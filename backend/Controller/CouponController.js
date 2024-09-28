import moment from "moment";
import Coupon from "../Model/CouponModel.js";
import User from "../Model/UserModel.js";
import AppError from "../Utills/AppError.js";

// create Coupon

const createCoupon = async (req, res, next) => {
    const localTime = moment();
    const newTime = localTime.format('YYYY-MM-DD HH:mm:ss');
    try {
        const userId = req.userId;
        const { couponName, discountPercentage, expiry, usageLimit ,title} = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return next(new AppError(404, "error", "User not found"));
        }

        if (user.role !== 'Admin') {
            return next(new AppError(403, "error", "You are unauthorized to perform this action"));
        }

        if (!couponName || !discountPercentage || !usageLimit || !expiry  || !title) {
            return next(new AppError(400, "error", "Please provide all required fields"));
        }

        const existingCoupon = await Coupon.findOne({ code: couponName });
        if (existingCoupon) {
            return next(new AppError(400, "error", "Coupon with this name already exists"));
        }

        const coupon = new Coupon({
            code: couponName,
            discountPercentage,
            expirationDate: expiry,
            usageLimit,
            createdAt:newTime,
            updatetedAt:null,
            title,
        });

        await coupon.save();

        return res.status(201).json({
            status: "success",
            message: "Coupon created successfully",
            data: coupon,
        });
    } catch (error) {
        return next(new AppError(500, "error", error.message));
    }
};

//update Coupon
const updateCoupon = async (req, res, next) => {
    try {
        const userId = req.userId;
        const { couponId, ...updateData } = req.body;

        // Ensure couponId is provided
        if (!couponId) {
            return next(new AppError(400, "error", "Coupon ID is required."));
        }

        // Verify the user is an Admin
        const user = await User.findById(userId);
        if (!user) {
            return next(new AppError(404, "error", "User not found"));
        }

        if (user.role !== 'Admin') {
            return next(new AppError(403, "error", "You are unauthorized to perform this action"));
        }

        // Get the current local time
        const localTime = moment().format('YYYY-MM-DD HH:mm:ss');

        // Update the coupon with the updatedAt field manually set
        const coupon = await Coupon.findById(couponId);
        if (!coupon) {
            return next(new AppError(404, "error", "Coupon not found"));
        }

        // Apply the update
        Object.assign(coupon, updateData);
        coupon.updatedAt = localTime;

        // Save the coupon
        await coupon.save();

        return res.status(200).json({
            status: "success",
            message: "Coupon updated successfully",
            data: coupon,
        });
    } catch (error) {
        return next(new AppError(500, "error", error.message));
    }
};




//delete Coupon
const deleteCoupon = async (req,res,next)=>{
    try {
        const userId = req.userId;
        const { couponId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return next(new AppError(404, "error", "User not found"));
        }

        if (user.role !== 'Admin') {
            return next(new AppError(403, "error", "You are unauthorized to perform this action"));
        }
        const coupon = await Coupon.findByIdAndDelete(couponId);
        if (!coupon) {
            return next(new AppError(404, "error", "Coupon not found"));
        }
        return res.status(200).json({
            status: "success",
            message: "Coupon deleted successfully"
        })
    } catch (error) {
        return next(new AppError(500, "error", error.message));
    }
}
// get A coupon

const getCoupon = async (req, res, next) => {
    try {
        const userId = req.userId;
        const { couponId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return next(new AppError(404, "error", "User not found"));
        }

        if (user.role!== 'Admin') {
            return next(new AppError(403, "error", "You are unauthorized to perform this action"));
        }

        const coupon = await Coupon.findById(couponId);

        if (!coupon) {
            return next(new AppError(404, "error", "Coupon not found"));
        }

        return res.status(200).json({
            status: "success",
            data: coupon,
        });
    } catch (error) {
        return next(new AppError(500, "'error'", error.message));
    }
}

const getAllCoupon = async (req,res,next)=>{
    try {
        // const userId = req.userId;

        // const user = await User.findById(userId);
        // if (!user) {
        //     return next(new AppError(404, "error", "User not found"));
        // }

        const coupon = await Coupon.find();

        if (!coupon) {
            return next(new AppError(404, "error", "Coupon not found"));
        }
        return res.status(200).json({
            status: "success",
            data: coupon,
        });
    } catch (error) {
        return next(new AppError(500, "'error'", error.message));
    }
}
export {createCoupon,updateCoupon,deleteCoupon,getCoupon,getAllCoupon};