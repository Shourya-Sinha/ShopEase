import express from 'express';
import { isAdmin, protect } from '../Controller/AuthController.js';
import { createCoupon, deleteCoupon, getAllCoupon, getCoupon, updateCoupon } from '../Controller/CouponController.js';

const router = express.Router();

router.post('/create-coupon',protect,isAdmin,createCoupon);
router.put('/update-coupon',protect,isAdmin,updateCoupon);
router.delete('/delete-coupon/:couponId',protect,isAdmin,deleteCoupon);
router.get('/getAll-coupon',getAllCoupon);
router.get('/getA-coupon/:couponId',protect,getCoupon);

export default router;