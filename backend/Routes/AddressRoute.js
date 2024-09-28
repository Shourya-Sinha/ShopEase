import express from 'express';
import { protect } from '../Controller/AuthController.js';
import { addAddress, changeDefaultState, deleteAAddress, getAllAddress, updateAddress } from '../Controller/AddressController.js';

const router = express.Router();

router.post('/add-address',protect,addAddress);
router.put('/update-address/:addressId',protect,updateAddress);
router.get('/getall-address',protect,getAllAddress);
router.delete('/delete-address/:id',protect,deleteAAddress);
router.put('/update-status/:addressId',protect,changeDefaultState);

export default router; 