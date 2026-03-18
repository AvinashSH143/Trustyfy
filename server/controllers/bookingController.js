import Booking from '../models/Booking.js';
import Provider from '../models/Provider.js';
import User from '../models/User.js';
import { processTrustEvent } from '../utils/trustEngine.js';
import { sendOTP } from '../utils/mailService.js';
import { getIO } from '../socket.js';

// @desc    Create a new booking
export const createBooking = async (req, res) => {
  const { providerId, serviceDate, coordinates } = req.body;

  const booking = await Booking.create({
    customer: req.user._id,
    provider: providerId,
    serviceDate,
    location: {
      type: 'Point',
      coordinates
    }
  });

  if (booking) {
    res.status(201).json(booking);
  } else {
    res.status(400).json({ message: 'Invalid booking data' });
  }
};

// @desc    Update booking status (Trigger Trust Events)
export const updateBookingStatus = async (req, res) => {
  try {
    const { status, eventType, otp } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // If finishing job, verify OTP
    if (status === 'COMPLETED') {
      if (!otp || otp !== booking.completionOTP) {
        return res.status(400).json({ message: 'Invalid or missing OTP' });
      }
    }

    // 1. Primary Action: Update status and save
    booking.status = status || booking.status;

    // If completing or cancelling, process trust events BEFORE population
    // This ensures we work with raw IDs and avoid stale data in the final populated response
    try {
      const validTrustEvents = ['COMPLETED', 'ON_TIME', 'LATE', 'CANCELLED', 'DISPUTED', 'REPEAT_CUSTOMER'];

      if (eventType && validTrustEvents.includes(eventType)) {
        console.log(`[TrustEngine] Triggering effect for Booking ${booking._id}: ${eventType}`);

        // Pass the raw provider ID to ensure TrustEngine can find and update it correctly
        await processTrustEvent(booking.provider, booking._id, eventType);

        // Update customer statistics if applicable
        const customer = await User.findById(booking.customer);
        if (customer) {
          if (!customer.stats) customer.stats = { jobsTaken: 0, cancellations: 0 };
          if (eventType === 'COMPLETED') customer.stats.jobsTaken += 1;
          if (eventType === 'CANCELLED') customer.stats.cancellations += 1;
          await customer.save();
        }
      }
    } catch (effectError) {
      console.error('Warning: Secondary booking effects (Trust/Stats) failed:', effectError);
    }

    // Now save the booking status
    const savedBooking = await booking.save();

    // 2. Final Step: Populate with the LATEST data from the database
    // This ensures stats updated by TrustEngine are reflected in the response
    await savedBooking.populate('customer provider', 'name email trustScore reliabilityLevel serviceType stats avatar');

    // Notify of booking status changes via socket
    try {
      const io = getIO();
      if (io) {
        io.to(booking._id.toString()).emit('status_update', savedBooking);
        // Also notify provider specifically to refresh their dashboard
        io.to(booking.provider.toString()).emit('profile_refresh');
      }
    } catch (socketError) {
      console.error('Socket notification failed:', socketError);
    }

    // 3. Success Response with FRESH data
    return res.json(savedBooking);

  } catch (error) {
    console.error('Critical Error in updateBookingStatus:', error);
    return res.status(500).json({
      message: 'Server error while updating booking',
      error: error.message
    });
  }
};

// @desc    Generate and send completion OTP
export const sendCompletionOTP = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    booking.completionOTP = otp;
    await booking.save();

    // Populate after save to ensure fresh data and populated refs
    await booking.populate('customer provider');

    console.log('--------------------------------');
    console.log(`[DEV] OTP for Booking ${booking._id}: ${otp}`);
    console.log(`[DEV] Customer: ${booking.customer?.email}, Provider: ${booking.provider?.name}`);
    console.log('--------------------------------');

    // Emit OTP via Socket.io to the booking room (Instant Delivery)
    const io = getIO();
    if (io) {
      io.to(booking._id.toString()).emit('receive_otp', {
        otp,
        bookingId: booking._id.toString(),
        providerName: booking.provider?.name || 'Your Provider'
      });
    }

    // Attempt to send email
    const emailSuccess = await sendOTP(booking.customer?.email, otp, booking._id);

    if (emailSuccess) {
      res.json({ message: 'OTP sent to customer (Email & In-App)' });
    } else {
      res.json({
        message: 'OTP sent in-app (Email failed - check server logs)',
        emailError: true
      });
    }
  } catch (error) {
    console.error('Error in sendCompletionOTP:', error);
    res.status(500).json({ message: 'Server error while sending OTP', error: error.message });
  }
};

// @desc    Get bookings for a user (Customer or Provider)
export const getMyBookings = async (req, res) => {
  const bookings = await Booking.find({
    $or: [{ customer: req.user._id }, { provider: req.user._id }]
  }).populate('customer provider', 'name email trustScore reliabilityLevel');

  res.json(bookings);
};

// @desc    Get nearby providers (Discovery)
export const getNearbyProviders = async (req, res) => {
  const { lat, lng, radius = 5000 } = req.query; // radius in meters

  const providers = await Provider.find({
    isApproved: true,
    location: {
      $near: {
        $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
        $maxDistance: parseInt(radius)
      }
    }
  }).select('-password').sort({ trustScore: -1 }); // Rank by Trust Score

  res.json(providers);
};
