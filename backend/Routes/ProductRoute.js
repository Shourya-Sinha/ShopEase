import express from "express";
import { isAdmin, protect } from "../Controller/AuthController.js";
import {
  dynamicFileUpload,
  handleFileSizeError,
  uploadPhoto,
  uploadPhotoArray,
} from "../MiddleWares/UploadImages.js";
import { createProduct, findAProduct, getAllProduct, getProductsByCategory, ratings, updateProduct } from "../Controller/ProductController.js";

const router = express.Router();

// router.post('/create-product',protect,isAdmin,uploadPhoto.array('colorData[][images][]', 16),handleFileSizeError,createProduct);
router.post(
  "/create-product",
  protect,
  isAdmin,
  uploadPhotoArray, // Handle all images uniformly
  handleFileSizeError,
  createProduct
);

 router.post('/update-product/:productId',protect,isAdmin,uploadPhotoArray,handleFileSizeError,updateProduct);
 router.get('/geta-product/:productId',findAProduct);
// router.delete('/delete-category',protect,isAdmin,deleteCategory);
 router.get('/getAll-product',getAllProduct);
 router.post('/sendRatings',protect,ratings);
 router.post('/getCategoryProduct', getProductsByCategory);

export default router;
