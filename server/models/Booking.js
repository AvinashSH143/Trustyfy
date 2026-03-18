import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true },
  status: {
    type: String,
    enum: ['PENDING', 'ACCEPTED', 'EN_ROUTE', 'STARTED', 'COMPLETED', 'CANCELLED', 'DISPUTED'],
    default: 'PENDING'
  },
  serviceDate: { type: Date, required: true },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number] }
  },
  completionOTP: { type: String }
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
