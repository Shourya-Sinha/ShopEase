import express from 'express';
import { isAdmin, protect } from '../Controller/AuthController.js';
import { handleFileSizeError, uploadPhoto } from '../MiddleWares/UploadImages.js';
import { createBrand, deleteBrand, getAllBrand, updateBrand } from '../Controller/BrandController.js';

const router = express.Router();


router.post('/create-brand',protect,isAdmin,uploadPhoto.single('brandlogo'),handleFileSizeError,createBrand);
router.post('/update-brand',protect,isAdmin,uploadPhoto.single('brandlogo'),handleFileSizeError,updateBrand);
router.delete('/delete-brand',protect,isAdmin,deleteBrand);
router.get('/getAll-brand',getAllBrand);


export default router;

