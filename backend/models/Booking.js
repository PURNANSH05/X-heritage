import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    type: { type: String, required: true },
    userId: String,
    details: mongoose.Schema.Types.Mixed,
    passengerDetails: mongoose.Schema.Types.Mixed,
    paymentMethod: mongoose.Schema.Types.Mixed,
    status: { type: String, default: 'confirmed' },
    pnr: String,
    bookedAt: { type: Date, default: Date.now },
    totalAmount: { type: Number, default: 0 }
  },
  { versionKey: false }
);

export default mongoose.model('Booking', bookingSchema);
