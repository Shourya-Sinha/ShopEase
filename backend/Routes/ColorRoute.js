import express from 'express';
import { isAdmin, protect } from '../Controller/AuthController.js';
import { createColor, deleteColor, getAllColor, updateColor } from '../Controller/ColorController.js';

const router = express.Router();

router.post('/create-color',protect,isAdmin,createColor);
router.put('/update-color',protect,isAdmin,updateColor);
router.delete('/delete-color',protect,isAdmin,deleteColor);
router.get('/getAll-color',getAllColor);

export default router;