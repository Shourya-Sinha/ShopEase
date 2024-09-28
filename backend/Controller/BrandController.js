import { uploadBrandLogo } from "../MiddleWares/UploadImages.js";
import Brand from "../Model/BrandModel.js";
import User from "../Model/UserModel.js";
import AppError from "../Utills/AppError.js";
import { v2 as cloudinary } from "cloudinary";
import moment from "moment";
// create Color
const createBrand = async (req, res, next) => {
    const localTime = moment();
    const newTime = localTime.format('YYYY-MM-DD HH:mm:ss');
    try {
        const id = req.userId;
        const user = await User.findById(id);
        const { title } = req.body;

        if (!user) {
            return next(new AppError(404, "error", "User not found"));
        }
        if (user.role !== 'Admin') {
            return next(new AppError(403, "error", "You are unauthorized to perform this action"));
        }
        const existingBrand = await Brand.findOne({ title });
        if (existingBrand) {
            return next(new AppError(400, "error", "Brand with this title already exists"));
        }

        let brandlogo = null;

        // Handling file upload if a brand logo is provided
        if (req.file) {
            // Upload the brand logo and get its details (secure_url and public_id)
            brandlogo = await uploadBrandLogo(req.file);
        }

        // Creating the brand with the necessary details, including the logo if provided
        const newBrand = new Brand({
            ...req.body,
            brandlogo, // Add the uploaded logo details here
            createdAt: newTime,
            updatedAt: null,
        });

        await newBrand.save();

        return res.status(201).json({
            status: 'success',
            message: 'Brand created successfully',
            data: newBrand,
        });
    } catch (error) {
        return next(new AppError(500, "error", error.message));
    }
};

//update color 
const updateBrand = async (req, res, next) => {
    const localTime = moment();
    const newTime = localTime.format('YYYY-MM-DD HH:mm:ss');
    try {
        const userId = req.userId;
        const { brandId, title } = req.body;
        // Fetch user
        const user = await User.findById(userId);
        if (!user) {
            return next(new AppError(404, "error", "User not found"));
        }
        if (user.role !== 'Admin') {
            return next(new AppError(403, "error", "You are unauthorized to use this"));
        }
        const existingBrand = await Brand.findOne({ title, _id: { $ne: brandId } });
        if (existingBrand) {
            return next(new AppError(400, "error", "Brand with this title already exists"));
        }

        // Find the brand to update
        const brand = await Brand.findById(brandId);
        if (!brand) {
            return next(new AppError(404, "error", "Brand not found"));
        }

        // Handle file upload if present
        if (req.file) {
            const existingPublicId = brand.brandlogo ? brand.brandlogo.public_id : null;
            const brandlogo = await uploadBrandLogo(req.file, existingPublicId);
            brand.brandlogo = brandlogo;
        }

        // Update brand details
        Object.assign(brand, req.body);
        brand.updatedAt = newTime;

        // Save updated brand
        await brand.save();
        return res.status(200).json({
            status: 'success',
            message: 'Successfully updated Brand',
            data: brand,
        });
    } catch (error) {
        return next(new AppError(500, "error", error.message));
    }
};

//deleteColor
const deleteBrand = async (req,res,next)=>{
    try {
        const id = req.userId;
        const {brandId} = req.body;

        const user = await User.findById(id);

        if(!user){
            return next(new AppError(404, "error", "User not found"));
        }
        if(user.role !== 'Admin'){
            return next(new AppError(403, "error", "You are unAuthrize to use this"));
        }
        const brand = await Brand.findById(brandId);
        if(!brand){
            return next(new AppError(404, "error", "Brand not found"));
        }
        if(brand.brandlogo && brand.brandlogo.public_id){
            const deleteResponse = await cloudinary.uploader.destroy(brand.brandlogo.public_id);
            if(deleteResponse.result !== 'ok'){
                return next(new AppError(500, "error", "Failed to delete brand logo from cloudinary"));
            }
        }
        await Brand.findByIdAndDelete(brandId);

        return res.status(201).json({
            status:'success',
            message:'Successfully deleted Brand',
        })
    } catch (error) {
        return next(new AppError(500, "error", error.message));
    }
}
//getAllColor
const getAllBrand = async(req,res,next)=>{
    try {
        const brands = await Brand.find();
        return res.status(200).json({
            status:'success',
            data:brands,
        })
    } catch (error) {
        return next(new AppError(500, "error", error.message));
    }
}

export {createBrand,updateBrand,deleteBrand,getAllBrand};