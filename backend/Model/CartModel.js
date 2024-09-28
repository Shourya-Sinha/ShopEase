import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required:true
    },
    selectedColour:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Color',
        required:true
    },
    selectedVariant:{
        type:String,
        required:true
    },
    quantity:{
        type:Number,
        required:true,
        min:1
    },
    price:{
        type:Number,
        required:true,
    },

}, { timestamps: true });

const cartSchema = new mongoose.Schema({
    orderBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    coupon: {
        code: { type: String }, // Coupon code applied
        discount: { type: Number, default: 0 } // Discount amount or percentage
    },
    totalPrice: {
        type: mongoose.Schema.Types.Decimal128, // Total
        required: true,
    },
    discountedPrice: {
        type: Number,
        required: true
    },
    discountAmount:{
        type: Number,
        default: 0  
    },
    items: [cartItemSchema]
}, { timestamps: true });

cartSchema.methods.calculateTotal = function() {
    const total = this.items.reduce((total, item) => total + (parseFloat(item.price.toString()) * item.quantity), 0);
    return mongoose.Types.Decimal128.fromString(total.toFixed(2));
  };
  
cartSchema.methods.getUserFeedback = function() {
    return {
        success: true,
        message: "Cart updated successfully."
    };
};

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;