import moment from "moment";
import Color from "../Model/ColorModel.js";
import User from "../Model/UserModel.js";
import AppError from "../Utills/AppError.js";

// create Color
const createColor = async (req,res,next)=>{
    const localTime= moment();
    const newTime = localTime.format('YYYY-MM-DD HH:mm:ss');
    try {
        const id = req.userId;
    
        const user = await User.findById(id);
    
        if (!user) {
          return next(new AppError(404, "error", "User not found"));
        }
        if (user.role !== 'Admin') {
          return next(new AppError(403, "error", "You are unauthorized to use this"));
        }
    
        const { title, hexCode } = req.body;
        const existingColor = await Color.findOne({ title: title, hexCode: hexCode });
        if (existingColor && existingColor.title === title && existingColor.hexCode === hexCode) {
          return next(new AppError(500, "error", "This color combination already exists"));
        }
    
        const newColor = new Color({ title, hexCode, createdAt: newTime, updatedAt: null });
        await newColor.save();
        return res.status(201).json({
          status: 'success',
          message: 'Successfully created color',
          data: newColor,
        })
    }catch (error) {
        return next(new AppError(500, "error", error.message));
    }
}
//update color 
const updateColor = async (req,res,next)=>{
    const localTime= moment();
    const newTime = localTime.format('YYYY-MM-DD HH:mm:ss');
    try {
        const id = req.userId;
        const {colorId,title,hexCode} = req.body;

        const user = await User.findById(id);

        if(!user){
            return next(new AppError(404, "error", "User not found"));
        }
        if(user.role !== 'Admin'){
            return next(new AppError(403, "error", "You are unAuthrize to use this"));
        }
        const color =await Color.findById(colorId);
        if(!color){
            return next(new AppError(404, "error", "Color not found"));
        }
        const existingColor = await Color.findOne({
            _id: { $ne: colorId }, // Exclude the current category
            title,
            hexCode
        });
        if (existingColor) {
            return next(new AppError(400, "error", "Color with this title and hexCode already exists"));
        }
        color.title = title;
        color.hexCode = hexCode;
        color.updatedAt = newTime,
        await color.save();
        return res.status(201).json({
            status:'success',
            message:'Successfully updated Color',
            data:color,
        })
    } catch (error) {
        return next(new AppError(500, "error", error.message));
    }
}
//deleteColor
const deleteColor = async (req,res,next)=>{
    const localTime= moment();
    const newTime = localTime.format('YYYY-MM-DD HH:mm:ss');
    try {
        const id = req.userId;
        const {colorId} = req.body;

        const user = await User.findById(id);

        if(!user){
            return next(new AppError(404, "error", "User not found"));
        }
        if(user.role !== 'Admin'){
            return next(new AppError(403, "error", "You are unAuthrize to use this"));
        }
        const color =await Color.findByIdAndDelete(colorId);
        if(!color){
            return next(new AppError(404, "error", "Color not found"));
        }
       
        return res.status(201).json({
            status:'success',
            message:'Successfully deleted Color',
        })
    } catch (error) {
        return next(new AppError(500, "error", error.message));
    }
}
//getAllColor
const getAllColor = async(req,res,next)=>{
    try {
        const colors = await Color.find();
        return res.status(200).json({
            status:'success',
            data:colors,
        })
    } catch (error) {
        return next(new AppError(500, "error", error.message));
    }
}

export {createColor,updateColor,deleteColor,getAllColor};