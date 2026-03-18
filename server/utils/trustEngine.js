import Provider from '../models/Provider.js';
import Event from '../models/Event.js';
import { getIO } from '../socket.js';

const weights = {
  'COMPLETED': 5,
  'ON_TIME': 3,
  'LATE': -4,
  'CANCELLED': -6,
  'DISPUTED': -8,
  'REPEAT_CUSTOMER': 8
};

/**
 * Recalculates and updates the trust score for a provider based on a new event.
 * @param {string} providerId - ID of the provider
 * @param {string} bookingId - ID of the booking
 * @param {string} eventType - Type of behavior event
 */
export const processTrustEvent = async (providerId, bookingId, eventType) => {
  try {
    const pid = providerId._id || providerId;
    const bid = bookingId._id || bookingId;

    const impact = weights[eventType] || 0;

    // Create the event record
    const newEvent = await Event.create({
      provider: pid,
      booking: bid,
      type: eventType,
      impact: impact
    });

    // Update provider score and stats
    const provider = await Provider.findById(pid);
    if (!provider) {
      console.error(`[TrustEngine] Provider ${pid} not found!`);
      return;
    }

    // The score starts at the schema default (0)
    provider.trustScore += impact;

    // Clamp score between 0 and 100
    provider.trustScore = Math.min(Math.max(provider.trustScore, 0), 100);

    // Update statistics
    if (!provider.stats) {
      provider.stats = { jobsCompleted: 0, onTimeArrivals: 0, cancellations: 0, disputes: 0 };
    }

    if (eventType === 'COMPLETED') provider.stats.jobsCompleted += 1;
    if (eventType === 'ON_TIME') provider.stats.onTimeArrivals += 1;
    if (eventType === 'CANCELLED') provider.stats.cancellations += 1;
    if (eventType === 'DISPUTED') provider.stats.disputes += 1;

    // Update Reliability Level
    if (provider.trustScore >= 80) {
      provider.reliabilityLevel = 'HIGH';
    } else if (provider.trustScore >= 40) {
      provider.reliabilityLevel = 'MEDIUM';
    } else {
      provider.reliabilityLevel = 'LOW';
    }

    // Explicitly mark stats as modified for Mongoose to detect changes in nested object
    provider.markModified('stats');
    await provider.save();

    console.log(`[TrustEngine] Success: Updated ${provider.name} | Score: ${provider.trustScore} | Jobs: ${provider.stats.jobsCompleted}`);

    // Notify provider of score update via Socket.io
    const io = getIO();
    if (io) {
      io.to(pid.toString()).emit('trust_update', { score: provider.trustScore, level: provider.reliabilityLevel });
    }

    return { score: provider.trustScore, level: provider.reliabilityLevel };
  } catch (error) {
    console.error('[TrustEngine] ERROR:', error);
  }
};
