import moment from "moment";
import Category from "../Model/CategoryModel.js";
import User from "../Model/UserModel.js";
import AppError from "../Utills/AppError.js";
import { v2 as cloudinary } from "cloudinary";
import { uploadCategoryPic } from "../MiddleWares/UploadImages.js";

// create Category
const createCategory = async (req,res,next)=>{
    const localTime= moment();
    const newTime = localTime.format('YYYY-MM-DD HH:mm:ss');
    try {
        const id = req.userId;

        const user = await User.findById(id);
        const { categoryName,subCategory } = req.body;

        if(!user){
            return next(new AppError(404, "error", "User not found"));
        }
        if(user.role !== 'Admin'){
            return next(new AppError(403, "error", "You are unAuthrize to use this"));
        }

        const existingBrand = await Category.findOne({ categoryName });
        if (existingBrand && existingBrand.subCategory === subCategory) {
            return next(new AppError(400, "error", "Category with this title and subcategory already exists"));
        }
        let catPic = null;

        if(req.file){
            catPic = await uploadCategoryPic(req.file);
        }
        
        const newCategory = new Category({...req.body,catPic,createdAt:newTime,updatedAt:null});
        await newCategory.save();
        return res.status(201).json({
            status:'success',
            message:'Successfully created Category',
            data:newCategory,
        })
    } catch (error) {
        return next(new AppError(500, "error", error.message));
    }
}
//update  Category 
// const updateCategory = async (req,res,next)=>{
//     const localTime= moment();
//     const newTime = localTime.format('YYYY-MM-DD HH:mm:ss');
//     try {
//         const id = req.userId;
//         const {categoryId,subCategory,categoryName} = req.body;

//         const user = await User.findById(id);

//         if(!user){
//             return next(new AppError(404, "error", "User not found"));
//         }
//         if(user.role !== 'Admin'){
//             return next(new AppError(403, "error", "You are unAuthrize to use this"));
//         }
//         const category = await Category.findById(categoryId);
//         if (!category) {
//             return next(new AppError(404, "error", "Category not found"));
//         }
//         const existingCategory = await Category.findOne({
//             _id: { $ne: categoryId }, // Exclude the current category
//             categoryName,
//             subCategory
//         });
//         if (existingCategory) {
//             return next(new AppError(400, "error", "Category with this title and subcategory already exists"));
//         }
//         if (req.file) {
//             const existingPublicId = category.catPic ? category.catPic.public_id : null;
//             const catPic = await uploadCategoryPic(req.file, existingPublicId);
//             category.catPic = catPic;
//         }

//         // Update other fields from request body
//         if (categoryName) {
//             category.categoryName = categoryName;
//         }
//         if (subCategory) {
//             category.subCategory = subCategory;
//         }
        
//         category.updatedAt = newTime; // Update the timestamp

//         // Save the updated category
//         await category.save();
//         return res.status(201).json({
//             status:'success',
//             message:'Successfully updated Category',
//             data:category,
//         })
//     } catch (error) {
//         return next(new AppError(500, "error", error.message));
//     }
// }
const updateCategory = async (req, res, next) => {
    const localTime = moment();
    const newTime = localTime.format('YYYY-MM-DD HH:mm:ss');
    try {
        const id = req.userId;
        const { categoryId, subCategory, categoryName } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return next(new AppError(404, "error", "User not found"));
        }
        if (user.role !== 'Admin') {
            return next(new AppError(403, "error", "You are unauthorized to use this"));
        }
        const category = await Category.findById(categoryId);
        if (!category) {
            return next(new AppError(404, "error", "Category not found"));
        }

        const existingCategory = await Category.findOne({
            _id: { $ne: categoryId }, // Exclude the current category
            categoryName,
            subCategory
        });
        if (existingCategory) {
            return next(new AppError(400, "error", "Category with this title and subcategory already exists"));
        }
        if (req.file) {
            const existingPublicId = category.catPic ? category.catPic.public_id : null;
            const catPic = await uploadCategoryPic(req.file, existingPublicId);
            category.catPic = catPic;
        }

        // Update other fields from request body
        if (categoryName) {
            category.categoryName = categoryName;
        }
        if (subCategory) {
            category.subCategory = subCategory;
        }
        
        category.updatedAt = newTime; // Update the timestamp

        // Save the updated category
        await category.save();
        return res.status(200).json({
            status: 'success',
            message: 'Successfully updated Category',
            data: category,
        });
    } catch (error) {
        console.error('Update category error:', error);
        return next(new AppError(500, "error", error.message));
    }
};

//delete Category
const deleteCategory = async (req,res,next)=>{
    try {
        const id = req.userId;
        const {categoryId} = req.body;

        const user = await User.findById(id);

        if(!user){
            return next(new AppError(404, "error", "User not found"));
        }
        if(user.role !== 'Admin'){
            return next(new AppError(403, "error", "You are not unAuthrize to use this"));
        }
        const category = await Category.findById(categoryId);
        if (!category) {
            return next(new AppError(404, "error", "Category not found"));
        }
        // Delete the image from Cloudinary if it exists
        if (category.catPic && category.catPic.public_id) {
            const deleteResponse = await cloudinary.uploader.destroy(category.catPic.public_id);
            if (deleteResponse.result !== 'ok') {
                return next(new AppError(500, "error", "Failed to delete Category PIC from Cloudinary"));
            }
        }

        // Delete the category from the database
        await Category.findByIdAndDelete(categoryId);
        return res.status(201).json({
            status:'success',
            message:'Successfully deleted Category',
        })
    } catch (error) {
        return next(new AppError(500, "error", error.message));
    }
}
//getAll Category
const getAllCategory = async(req,res,next)=>{
    try {
        const categories = await Category.find();
        return res.status(200).json({
            status:'success',
            data:categories,
        })
    } catch (error) {
        return next(new AppError(500, "error", error.message));
    }
}

export {createCategory,updateCategory,deleteCategory,getAllCategory};