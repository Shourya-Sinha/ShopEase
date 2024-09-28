import express from 'express';
import { isAdmin, protect } from '../Controller/AuthController.js';
import { handleFileSizeError, uploadPhoto } from '../MiddleWares/UploadImages.js';
import { createCategory, deleteCategory, getAllCategory, updateCategory } from '../Controller/CategoryController.js';

const router = express.Router();

router.post('/create-category',protect,isAdmin,uploadPhoto.single('catPic'),handleFileSizeError,createCategory);
router.post('/update-category',protect,isAdmin,uploadPhoto.single('catPic'),handleFileSizeError,updateCategory);
router.delete('/delete-category',protect,isAdmin,deleteCategory);
router.get('/getAll-category',getAllCategory);

export default router;