import moment from "moment";
import mongoose from "mongoose";

const cloudinaryUrlRegex = /^https:\/\/res\.cloudinary\.com\/[a-zA-Z0-9_-]+\/image\/upload\/v\d+\/[a-zA-Z0-9_\/-]+\.jpg$/;
const cloudinaryPublicIdRegex = /^[a-zA-Z0-9_\/-]+$/;

const variantSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "128GB", "256GB", "512GB"
  price:{
    type: Number,
    required: true,
    min: 0,
},
  quantity:{
    type: Number,
    required: true,
    min: 1,
},
});

const colorSchema = new mongoose.Schema({
  color: { type: mongoose.Schema.Types.ObjectId, ref: 'Color' }, // Color ID
  variants: [variantSchema], // Each color can have multiple variants
  images: [{ // Images specific to this color
    secure_url:{
      type: String,
      required: true,
  },
    public_id: {
      type: String,
      required: true,
  }
  }]
});


const productSchema = new mongoose.Schema({
  name:{
        type: String,
        required: true,
        unique: true,
        minlength: [3, 'Product Name must be at least 3 characters long'],
        maxlength: [300, 'Product Name must be at most 100 characters long'],
        trim: true
    },
    description:{
        type: String,
        required: true,
        minlength: [10, 'Description must be at least 10 characters long'],
        maxlength: [800, 'Description must be at most 500 characters long'],
        trim: true
    },

    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category',
        required: true
    },
   
    brand:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'BrandModel',
        required: true
    },
  colors: [colorSchema],
    tags:{
        type: String,
        required: true,
        enum: ["Featured","Hot","Trending","Normal","Sale"],
        default: "Normal",
    },
    sold:{
        type:Number,
        default:0
    },
    totalRatings:{
        type:Number,
        default:0
    },
    ratings:[{
        star: {
          type: Number,
          min: 1,
          max: 5,
          required: true,
        },
        revTitle:String,
        comment:String,
        postedBy:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
    }],
    createdAt:{
        type: Date,
        default: new Date()
    },
    updatedAt:{
        type: Date,
        default: new Date(),
        select: false,
    },
});

productSchema.index({ totalRatings: -1 });

productSchema.methods.updateRating = async function() {
  if (this.ratings.length > 0) {
    // Calculate the sum of all ratings
    const sum = this.ratings.reduce((acc, rating) => acc + rating.star, 0);

    // Calculate the average rating and round it to 2 decimal places
    const newTotalRatings = (sum / this.ratings.length).toFixed(2);

    // Check if the new total ratings differ from the current totalRatings to avoid unnecessary save
    if (newTotalRatings !== this.totalRatings) {
      this.totalRatings = newTotalRatings;
      
      // Update the `updatedAt` field manually to reflect rating update
      this.updatedAt = new Date();
      
      // Save only if there's a change in the total rating
      await this.save();
    }
  } else {
    // If there are no ratings, set totalRatings to 0
    this.totalRatings = 0;
    this.updatedAt = new Date();
    await this.save();
  }
};



const Product = mongoose.model('Product', productSchema);

export default Product;