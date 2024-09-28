import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true, uppercase: true },
    title:{ type: String, required: true},
    discountPercentage: { type: Number, required: true },
    expirationDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    usageLimit: { type: Number, required: true },
    usageCount: { type: Number, default: 0 },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date, // Ensure this is correct
    }
});


const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;
