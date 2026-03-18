import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const providerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  serviceType: { type: String, required: true },
  serviceAreas: { type: [String], default: [] },
  isAvailable: { type: Boolean, default: true },
  isApproved: { type: Boolean, default: false },
  role: { type: String, default: 'provider' },
  avatar: { type: String, default: null },
  trustScore: { type: Number, default: 0 }, // Starting score
  reliabilityLevel: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'LOW' },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], required: true }
  },
  stats: {
    jobsCompleted: { type: Number, default: 0 },
    onTimeArrivals: { type: Number, default: 0 },
    cancellations: { type: Number, default: 0 },
    disputes: { type: Number, default: 0 }
  }
}, { timestamps: true });

providerSchema.index({ location: '2dsphere' });

providerSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

providerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Provider = mongoose.model('Provider', providerSchema);
export default Provider;
