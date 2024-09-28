import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true,
        unique: true,
        minlength: [2,'Brand Minimum Length 2 '],
        maxlength: [50,'Brand Maximum Length 50']
    },
    description:{
        type: String,
        trim: true,
        maxlength: [200,'Description Maximum Length 200']
    },
    brandlogo: {
       secure_url:{
        type: String,
        required: true
       },
       public_id:{
        type: String,
        required: true
       }
    },
    updatedAt:{
        type: Date,
        default: Date.now
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

const BrandModel = mongoose.model('BrandModel', brandSchema);

export default BrandModel;