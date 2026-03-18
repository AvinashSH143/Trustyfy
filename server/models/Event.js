import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  type: {
    type: String,
    enum: ['ACCEPTED', 'STARTED', 'EN_ROUTE', 'COMPLETED', 'ON_TIME', 'LATE', 'CANCELLED', 'DISPUTED', 'REPEAT_CUSTOMER'],
    required: true
  },
  impact: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);
export default Event;
