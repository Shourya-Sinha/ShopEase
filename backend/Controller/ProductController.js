import moment from "moment";
import {
  uploadImage,
  uploadProductImages,
} from "../MiddleWares/UploadImages.js";
import Product from "../Model/ProductModel.js";
import User from "../Model/UserModel.js";
import { v2 as cloudinary } from "cloudinary";
import AppError from "../Utills/AppError.js";
import Category from "../Model/CategoryModel.js";
import mongoose from "mongoose";
//create A product

const createProduct = async (req, res, next) => {
  const localTime = moment();
  const newTime = localTime.format("YYYY-MM-DD HH:mm:ss");
  try {
    const { name, description, category, brand, colorData, tags } = req.body;

    if (!name || typeof name !== "string") {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid or missing product name." });
    }
    if (!description || typeof description !== "string") {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid or missing description." });
    }
    if (!category || typeof category !== "string") {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid or missing category." });
    }
    if (!brand || typeof brand !== "string") {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid or missing brand." });
    }
    if (!Array.isArray(colorData) || colorData.length === 0) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid or missing color data." });
    }

    const colorArray = [];

    // Process each color and its variants
    for (let i = 0; i < colorData.length; i++) {
      const { colorId, variants, images } = colorData[i];

      if (!colorId || typeof colorId !== "string") {
        return res
          .status(400)
          .json({ status: "error", message: `Invalid colorId at index ${i}.` });
      }

      if (!Array.isArray(variants) || variants.length === 0) {
        return res.status(400).json({
          status: "error",
          message: `Invalid or missing variants at index ${i}.`,
        });
      }
      const processedImages = [];

      // Process images for this color
      if (req.files[`colorData[${i}][images][]`]) {
        for (const file of req.files[`colorData[${i}][images][]`]) {
          // Upload image and get response
          const uploadResponse = await uploadImage(file);
          processedImages.push({
            secure_url: uploadResponse.secure_url,
            public_id: uploadResponse.public_id,
          });
        }
      }

      // colorArray.push({
      //   color: colorId,
      //   variants: variants.map((v) => ({
      //     name: String(v.name), // Ensure name is a string
      //     price: parseFloat(v.price), // Ensure price is a number
      //     quantity: parseInt(v.quantity, 10), // Ensure quantity is a number
      //   })),
      //   images: processedImages,
      // });

      colorArray.push({
          color: colorId,
          variants: variants.map(v => {
              if (!v.name || typeof v.name !== 'string') {
                  throw new Error(`Invalid variant name: ${v.name}`);
              }
              if (isNaN(Number(v.price))) {
                  throw new Error(`Invalid variant price: ${v.price}`);
              }
              if (isNaN(Number(v.quantity))) {
                  throw new Error(`Invalid variant quantity: ${v.quantity}`);
              }
              return {
                  name: String(v.name), // Ensure name is a string
                  //price: parseFloat(v.price), // Ensure price is a number
                  price: parseFloat(v.price).toFixed(2),
                  quantity: parseInt(v.quantity, 10) // Ensure quantity is a number
              };
          }),
          images: processedImages,
      });
    }

    const newProduct = await Product.create({
      name,
      description,
      category,
      brand,
      tags: tags,
      createdAt: newTime,
      updatedAt: null,
      colors: colorArray,
    });

    return res.status(201).json({
      status: "success",
      message: "Product created successfully.",
      data: newProduct,
    });
  } catch (error) {
    return next(new AppError(500, "error", error.message));
  }
};

// update a product
const updateProduct = async (req, res, next) => {
  const localTime = moment();
  const newTime = localTime.format("YYYY-MM-DD HH:mm:ss");

  try {
    const { productId } = req.params;
    const { name, description, category, brand, colorData, tags } = req.body;

    // Validation checks
    if (!productId || typeof productId !== "string") {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid or missing product ID." });
    }
    // if (!name || typeof name !== "string") {
    //   return res
    //     .status(400)
    //     .json({ status: "error", message: "Invalid or missing product name." });
    // }
    // if (!description || typeof description !== "string") {
    //   return res
    //     .status(400)
    //     .json({ status: "error", message: "Invalid or missing description." });
    // }
    // if (!category || typeof category !== "string") {
    //   return res
    //     .status(400)
    //     .json({ status: "error", message: "Invalid or missing category." });
    // }
    // if (!brand || typeof brand !== "string") {
    //   return res
    //     .status(400)
    //     .json({ status: "error", message: "Invalid or missing brand." });
    // }
    if (!Array.isArray(colorData) || colorData.length === 0) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid or missing color data." });
    }

    // Find the product by ID
    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ status: "error", message: "Product not found." });
    }
    const colorArray = [];

    // Process each color and its variants
    for (let i = 0; i < colorData.length; i++) {
      const { colorId, variants, images } = colorData[i];

      if (!colorId || typeof colorId !== "string") {
        return res
          .status(400)
          .json({ status: "error", message: `Invalid colorId at index ${i}.` });
      }

      if (!Array.isArray(variants) || variants.length === 0) {
        return res.status(400).json({
          status: "error",
          message: `Invalid or missing variants at index ${i}.`,
        });
      }

      // Remove existing images if they exist
      if (
        product.colors[i] &&
        product.colors[i].images &&
        product.colors[i].images.length > 0
      ) {
        for (const img of product.colors[i].images) {
          await cloudinary.uploader.destroy(img.public_id);
        }
      }

      const processedImages = [];

      // Upload new images
      if (req.files[`colorData[${i}][images][]`]) {
        for (const file of req.files[`colorData[${i}][images][]`]) {
          const uploadResponse = await uploadImage(file);
          processedImages.push({
            secure_url: uploadResponse.secure_url,
            public_id: uploadResponse.public_id,
          });
        }
      }

      colorArray.push({
        color: colorId,
        variants: variants.map((v) => ({
          name: String(v.name), // Ensure name is a string
          price: parseFloat(v.price), // Ensure price is a number
          quantity: parseInt(v.quantity, 10), // Ensure quantity is a number
        })),
        images: processedImages, // Only new images are stored
      });
    }

    // Update the product fields
    product.name = name;
    product.description = description;
    product.category = category;
    product.brand = brand;
    product.tags = tags;
    product.colors = colorArray;
    product.updatedAt = newTime;

    // Save the updated product
    const updatedProduct = await product.save();

    res.status(200).json(updatedProduct);
  } catch (error) {
    return next(new AppError(500, "error", error.message));
  }
};

// find a Product by id
const findAProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid or missing product ID." });
    }

    const product = await Product.findById(productId)
      .populate("category")
      .populate("brand")
      .populate("colors.color");

    if (!product) {
      return res
        .status(404)
        .json({ status: "error", message: "Product not found." });
    }

    return res.status(200).json({
      status: "success",
      message: "Product fetched successfully.",
      data: product,
    });
  } catch (error) {
    return next(new AppError(500, "error", error.message));
  }
};

//find all product
const getAllProduct = async (req, res, next) => {
  try {
    // Fetch all products and populate related fields including ratings and postedBy
    const products = await Product.find()
      .populate("category")
      .populate("brand")
      .populate("colors.color")
      .populate('ratings.postedBy');
    // const products = await Product.find({});

    if (!products || products.length === 0) {
      return res
        .status(404)
        .json({ status: "error", message: "Products not found." });
    }

    // Calculate total ratings and average rating for each product
    const updatedProducts = products.map((product) => {
      const totalRatings = product.ratings.length;
      const sumOfStars = product.ratings.reduce((acc, rating) => acc + rating.star, 0);
      const averageRating = totalRatings > 0 ? (sumOfStars / totalRatings).toFixed(2) : 0;

      return {
        ...product.toObject(), // Convert mongoose document to plain object
        totalRatings: totalRatings,
        averageRating: Number(averageRating), // Return as a number, not string
      };
    });

    // Return the updated products with calculated ratings
    return res.status(200).json({
      status: "success",
      message: "Products fetched successfully.",
      data: updatedProducts,
    });
  } catch (error) {
    return next(new AppError(500, "error", error.message));
  }
};

// const getAllProduct = async (req, res, next) => {
//   try {
//     const products = await Product.find()
//       .populate("category")
//       .populate("brand")
//       .populate("colors.color");

//     if (!products) {
//       return res
//         .status(404)
//         .json({ status: "error", message: "Products not found." });
//     }

//         // Calculate total ratings and average rating
//         const updatedProducts = products.map((product) => {
//           const totalRatings = product.ratings.length;
//           const sumOfStars = product.ratings.reduce((acc, rating) => acc + rating.star, 0);
//           const averageRating = totalRatings > 0 ? sumOfStars / totalRatings : 0;
    
//           return {
//             ...product.toObject(), // Convert mongoose document to plain object
//             totalRatings: totalRatings,
//             averageRating: averageRating,
//           };
//         });

//         return res.status(200).json({
//           status: "success",
//           message: "Products fetched successfully.",
//           data: updatedProducts,
//         });
//     // return res.status(200).json({
//     //   status: "success",
//     //   message: "Products fetched successfully.",
//     //   data: product,
//     // });
//   } catch (error) {
//     return next(new AppError(500, "error", error.message));
//   }
// };

//add to wishlist
const addToWishlist = async (req, res, next) => {
  try {
    const { userId } = req.userId;
    const { productId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return next(new AppError(404, "error", "User not found"));
    }

    const alreadyAdded = user.wishlist.find(
      (id) => id.toString() === productId
    );

    if (alreadyAdded) {
      return res.status(400).json({
        status: "error",
        message: "Product already added to wishlist.",
      });
    } else {
      await User.findByIdAndUpdate(
        userId,
        { $push: { wishlist: productId } },
        { new: true }
      );
      return res.status(200).json({
        status: "success",
        message: "Product added to wishlist successfully.",
      });
    }
  } catch (error) {
    return next(new AppError(500, "error", error.message));
  }
};
// rate and comment on product
// const ratings = async (req, res, next) => {
//   try {
//     const { userId } = req.userId;

//     const { productId, comment, revTitle, star } = req.body;

//     const product = await Product.findById(productId);

//     let alreadyAdded = product.ratings.find(
//       (userId) => userId.postedBy.toString() === __dirname.toString()
//     );

//     if (alreadyAdded) {
//       return res.status(400).json({
//         status: "error",
//         message: "You have already rated this product.",
//       });
//     } else {
//       const ratedProduct = await Product.findByIdAndUpdate(
//         productId,
//         {
//           $push: {
//             ratings: {
//               star: star,
//               comment: comment,
//               postedBy: userId,
//               revTitle: revTitle,
//             },
//           },
//         },
//         { new: true }
//       );
//     }
//     const getAllRatings = await Product.findById(productId);
//     const totalRating = getAllRatings.ratings.length;
//     let ratingsum = getAllRatings.ratings.map((item)=> item.star).reduce((prev,cur)=>prev+cur,0);
//     let actualRating = Math.round(ratingsum /totalRating);
//     let finalProduct = await Product.findByIdAndUpdate(productId,{totalRatings:actualRating},{new:true});
//     return res.status(200).json({
//       status: "success",
//       message: "Rating and comment added successfully.",
//       finalProduct
//     });
//   } catch (error) {
//     return next(new AppError(500, "error", error.message));
//   }
// };
const ratings = async (req, res, next) => {
  try {
    const { userId } = req.userId; // Assuming userId is set in the request by authentication middleware
    const { productId, comment, revTitle, star } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    // Check if the user has already added a review
    let alreadyAdded = product.ratings.find(
      (rating) => rating.postedBy.toString() === userId.toString()
    );

    if (alreadyAdded) {
      return res.status(400).json({
        status: "error",
        message: "You have already rated this product.",
      });
    }

    // Add the new rating to the product
    product.ratings.push({
      star: star,
      comment: comment,
      postedBy: userId,
      revTitle: revTitle,
    });

    // Calculate total ratings and average rating
    const totalRating = product.ratings.length;
    const ratingSum = product.ratings.reduce((acc, rating) => acc + rating.star, 0);
    const actualRating = Math.round(ratingSum / totalRating);

    product.totalRatings = actualRating;

    await product.save(); // Save the updated product with new rating

    return res.status(200).json({
      status: "success",
      message: "Rating and comment added successfully.",
      product, // Return the updated product
    });
  } catch (error) {
    return next(new AppError(500, "error", error.message));
  }
};

// const getProductsByCategory = async (req, res) => {
//   const { categoryId, subCategoryName } = req.query;

//   try {
//     let products;

//     if (categoryId) {
//       // Fetch products by categoryId
//       if (!mongoose.Types.ObjectId.isValid(categoryId)) {
//         return res.status(400).json({ error: 'Invalid category ID' });
//       }

//       products = await Product.find({ category: categoryId }).populate('category', 'categoryName subCategory').populate('brand', 'name');
//     } else if (subCategoryName) {
//       // Fetch products by subCategoryName
//       const categories = await Category.find({ subCategory: { $regex: subCategoryName, $options: 'i' } });

//       if (categories.length === 0) {
//         return res.status(404).json({ message: 'No categories found with the provided subcategory name' });
//       }

//       const categoryIds = categories.map((cat) => cat._id);

//       products = await Product.find({ category: { $in: categoryIds } }).populate('category', 'categoryName subCategory').populate('brand', 'name');
//     } else {
//       return res.status(400).json({ message: 'Please provide either a categoryId or subCategoryName' });
//     }

//     if (products.length === 0) {
//       return res.status(404).json({ message: 'No products found for the given category or subcategory' });
//     }

//     // res.status(200).json(products);
//     return res.status(200).json({
//       status: "success",
//       message: "Products fetched successfully.",
//       // data: products.map((product) => product.toObject({ getters: true })),
//       data:products,
//     });
//   } catch (error) {
//     console.error('Error fetching products:', error);
//     return res.status(500).json({ message: error.message });
//   }
// };
const getProductsByCategory = async (req, res,next) => {
  const {categoryId} = req.body;
  const { subCategoryName } = req.body;

  try {
    let products;

    if (categoryId) {
      // Validate categoryId format before making any DB call
      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        return next(new AppError(400, "error", "Invalid category ID"));
      }

      products = await Product.find({ category: categoryId })
        .populate('category', 'categoryName subCategory')
        .populate('brand', 'name');
    } else if (subCategoryName) {
      // Fetch products by subCategoryName
      const categories = await Category.find({
        subCategory: { $regex: subCategoryName, $options: 'i' }
      });

      if (!categories.length) {
        return next(new AppError(404, "error", "No categories found with the provided subcategory name"));
      }

      const categoryIds = categories.map(cat => cat._id);
      products = await Product.find({ category: { $in: categoryIds } })
        .populate('category', 'categoryName subCategory')
        .populate('brand', 'name');
    } else {
      return next(new AppError(400, "error", "Please provide either a categoryId or subCategoryName"));
    }

    if (!products.length) {
      return next(new AppError(404, "error", "No products found for the given category or subcategory"));
    }

    return res.status(200).json({
      status: 'success',
      message: 'Products fetched successfully.',
      data: products,
    });
  } catch (error) {
    return next(new AppError(500, "error", error.message));
  }
};



export {
  createProduct,
  updateProduct,
  findAProduct,
  getAllProduct,
  addToWishlist,
  ratings,
  getProductsByCategory,
};
