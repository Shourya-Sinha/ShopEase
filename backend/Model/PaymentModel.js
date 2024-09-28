import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  orderBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['CreditCard', 'UPI', 'PayPal','COD'],
    required: true
  },
  amount: {
    type: mongoose.Schema.Types.Decimal128,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Success', 'Failed'],
    required: true
  },
  transactionId: {
    type: String,
    required: true,
    unique: true
  },
  paymentDetails: {
    // Additional fields can be added here based on payment method
    cardDetails: {
      cardType: String,
      last4: String, // Last 4 digits of the card
    },
    upiDetails: {
      vpa: String, // UPI VPA (Virtual Payment Address)
    },
    paypalDetails: {
      paypalId: String, // PayPal transaction ID
    }
  }
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
