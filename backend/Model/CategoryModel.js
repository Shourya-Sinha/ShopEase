import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  
    categoryName:{
        type:String,
    },
    subCategory:{
        type:String,
    },
    catPic: {
        secure_url:{
         type: String,
         required: true
        },
        public_id:{
         type: String,
         required: true
        }
     },
  createdAt: { type: Date, default: Date.now },
  updatedAt:{ type: Date, default: Date.now},
});

const Category = mongoose.model("Category", categorySchema);

export default Category;