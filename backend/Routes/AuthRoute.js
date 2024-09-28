import express from 'express';
import { addToCart, adminUpdateOrder, applyCoupon, checkTokenExpiration, createOrder, deleteItemFromCart, emptyCart, getAdminStats, getAllOrdersForAdmin, getMyCart, getMyOrder, getSingleOrder, loginUser, logoutUser, protect, registerUser, removeItemFromWishlist, resetPassowrdforToken, sendOtp, sendTokenForForgotPassowrd, updateCartItemQuantity, updatedUser, verifyOtp } from '../Controller/AuthController.js';
import { handleFileSizeError, uploadPhoto } from '../MiddleWares/UploadImages.js';
const router = express.Router();

router.post('/register-user',registerUser,sendOtp);
router.post('/send-otp',protect,sendOtp);
router.post('/verify-user',verifyOtp);
router.post('/login-user',loginUser);
router.post('/send-token',sendTokenForForgotPassowrd);
router.post('/reset-password',resetPassowrdforToken);
router.post('/update-me',protect,uploadPhoto.single('avatar'),handleFileSizeError,updatedUser);
router.post('/logout',protect,logoutUser);
router.post('/remove-wishlist',protect,removeItemFromWishlist);
// router.post('/addTo-Cart',protect,addToCart);
router.post('/add-to-cart', protect, addToCart);
router.post('/updateQyantity-Cart',protect,updateCartItemQuantity);
router.delete('/deleteItemon-Cart',protect,deleteItemFromCart);
router.post('/create-order',protect,createOrder);
router.get('/getMy-order',protect,getMyOrder);
router.get('/getAll-order',protect,getAllOrdersForAdmin);
router.get('/getSingle-order/:orderId',protect,getSingleOrder);
router.post('/applyCoupon-Cart',protect,applyCoupon);
router.put('/update-order-status',protect,adminUpdateOrder);
router.get('/admin-stats',protect,getAdminStats);
router.post('/check-token',checkTokenExpiration);
router.get('/getCart-data',protect,getMyCart);
router.delete('delete-FullCart',protect,emptyCart)




export default router;