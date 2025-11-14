import mongoose from 'mongoose';

const userPaymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    paymentPlatform: {
      type: String,
      enum: ['Easypaisa', 'JazzCash'],
      required: true,
    },
 
    accountUsername: {
      type: String,
      required: true,
      trim: true,
    },
    accountNumber: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export const UserPayment= mongoose.models.UserPayment || mongoose.model('UserPayment', userPaymentSchema);
