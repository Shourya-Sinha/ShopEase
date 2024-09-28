import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    selectedColour: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Color',
        required: true
    },
    selectedVariant: {
        type: String, // Store the variant name (e.g., "128GB")
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: mongoose.Schema.Types.Decimal128, // Use Decimal128 for price
        required: true,
        min: 0
    }
}, { timestamps: true });

const orderSchema = new mongoose.Schema({
    orderBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [orderItemSchema], // Order items schema
    coupon: {
        type: mongoose.Schema.Types.Mixed,
        code: { type: String },
        discount: { type: Number, default: 0 }
    },
    totalPrice: {
        type: mongoose.Schema.Types.Decimal128,
        required: true
    },
    discountedPrice: {
        type: mongoose.Schema.Types.Decimal128,
        default: 0.00
    },
    discountAmount: {
        type: mongoose.Schema.Types.Decimal128,
        default: 0.00
    },
    totalPaidByUser: {
        type: mongoose.Schema.Types.Decimal128,
        default: 0.00
    },
    deliveryStatus: {
        type: String,
        enum: ['Processing', 'Shipped', 'Out for Delivery', 'Pending', 'Delivered', 'Cancelled'],
        default: 'Processing'
    },
    selectedAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
        required: true
    },
    selectedShipping:{
        type: String,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['COD', 'PayPal', 'Card', 'UPI'],
        required: true
    },
    paymentInfo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment'
    },
    paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Refunded'], default: 'Pending' },
    deliveredAt: { type: Date },
    canceled: { type: Boolean, default: false },
    returnRequested: { type: Boolean, default: false },
    returnDeadline: { type: Date },
}, { timestamps: true }); // Automatically add createdAt and updatedAt

const Order = mongoose.model('Order', orderSchema);

export default Order;
