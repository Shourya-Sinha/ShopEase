import multer, { memoryStorage } from "multer";
import sharp from "sharp";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import AppError from "../Utills/AppError.js";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported File Format."), false);
  }
};

const uploadPhotoArray = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: {
    fileSize: 20000000, // 10MB
  }
}).fields([
  { name: 'colorData[0][images][]', maxCount: 20 },
  { name: 'colorData[1][images][]', maxCount: 20 },
  { name: 'colorData[2][images][]', maxCount: 20 },
  { name: 'colorData[3][images][]', maxCount: 20 },
  { name: 'colorData[4][images][]', maxCount: 20 },
  { name: 'colorData[5][images][]', maxCount: 20 },
  { name: 'colorData[6][images][]', maxCount: 20 },
  // Add more fields if you expect more colors
]);
const uploadPhoto = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: {
    fileSize: 20000000, // 10MB
  },
});

const handleFileSizeError = (err, req, res, next) => { 
    if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "Image file size should not be more than 10MB." });
    }
    next(err);
  };

const processImages = async (req, res, next) => {
  try {
    if (!req.files || !Array.isArray(req.files.images)) {
      return next(new AppError(400, "error", "No images uploaded"));
    }
    const resizedImages = await Promise.all(
      req.files.iamges.map(async (file) => {
        const maxSize = 3000000;
        let buffer = file.buffer;

        if (buffer.length > maxSize) {
          buffer = await sharp(file.buffer)
            .resize(300, 300)
            .toFormat("jpeg")
            .jpeg({ quality: 90 })
            .toBuffer();
        }
        return {
          ...file,
          buffer,
        };
      })
    );

    req.files.images = resizedImages;
    next();
  } catch (error) {
    return next(new AppError(400,"error",error.message))
  }
};
  
const uploadAvatar = async (file, existingPublicId) => {
    try {
      if (existingPublicId) {
        const deleteResponse = await cloudinary.uploader.destroy(existingPublicId);
        if (deleteResponse.result !== 'ok') {
          throw new Error(`Failed to delete image with public_id ${existingPublicId}`);
        }
      }
  
      // Upload the new image
      const uploadResponse = await new Promise((resolve, reject) => {
        const buffer = sharp(file.buffer)
        .resize({ width: 300, height: 300, fit: sharp.fit.inside, withoutEnlargement: true })
          .toFormat("jpg")
          .jpeg({ quality: 90 })
          .toBuffer();
  
        buffer.then((processedBuffer) => {
          cloudinary.uploader.upload_stream(
            { folder: "MyNewApp/UserPics", format: "jpg" },
            (error, result) => {
              if (error) {
                console.error('Upload Error:', error);
                reject(error);
              } else {
                resolve(result);
              }
            }
          ).end(processedBuffer);
        }).catch((error) => {
          console.error('Buffer Error:', error);
          reject(error);
        });
      });
  
      return {
        secure_url: uploadResponse.secure_url,
        public_id: uploadResponse.public_id,
      };
    } catch (error) {
      console.error('UploadAvatar Error:', error);
      throw error;
    }
  };
  
  const uploadBrandLogo = async (file, existingPublicId) => {
    try {
      // Log the existing public ID
  
      // If an existing image is present, destroy it before uploading the new one
      if (existingPublicId) {
        const deleteResponse = await cloudinary.uploader.destroy(existingPublicId);
        if (deleteResponse.result !== 'ok') {
          throw new Error(`Failed to delete image with public_id ${existingPublicId}`);
        }
      }
  
      // Upload the new image
      const uploadResponse = await new Promise((resolve, reject) => {
        const buffer = sharp(file.buffer)
        .resize({ width: 300, height: 300, fit: sharp.fit.inside, withoutEnlargement: true })
          .toFormat("jpg")
          .jpeg({ quality: 90 })
          .toBuffer();
  
        buffer.then((processedBuffer) => {
          cloudinary.uploader.upload_stream(
            { folder: "MyNewApp/BrandPics", format: "jpg" },
            (error, result) => {
              if (error) {
                console.error('Upload Error:', error);
                reject(error);
              } else {
                resolve(result);
              }
            }
          ).end(processedBuffer);
        }).catch((error) => {
          console.error('Buffer Error:', error);
          reject(error);
        });
      });
  
      return {
        secure_url: uploadResponse.secure_url,
        public_id: uploadResponse.public_id,
      };
    } catch (error) {
      console.error('UploadAvatar Error:', error);
      throw error;
    }
  };

  const uploadCategoryPic = async (file, existingPublicId) => {
    try {
      // Log the existing public ID
  
      // If an existing image is present, destroy it before uploading the new one
      if (existingPublicId) {
        const deleteResponse = await cloudinary.uploader.destroy(existingPublicId);
        if (deleteResponse.result !== 'ok') {
          throw new Error(`Failed to delete image with public_id ${existingPublicId}`);
        }
      }
  
      // Upload the new image
      const uploadResponse = await new Promise((resolve, reject) => {
        const buffer = sharp(file.buffer)
        .resize({ width: 400, height: 600, fit: sharp.fit.inside, withoutEnlargement: true })
          .toFormat("jpg")
          .jpeg({ quality: 90 })
          .toBuffer();
  
        buffer.then((processedBuffer) => {
          cloudinary.uploader.upload_stream(
            { folder: "MyNewApp/CategoryPics", format: "jpg" },
            (error, result) => {
              if (error) {
                console.error('Upload Error:', error);
                reject(error);
              } else {
                resolve(result);
              }
            }
          ).end(processedBuffer);
        }).catch((error) => {
          console.error('Buffer Error:', error);
          reject(error);
        });
      });
  
      return {
        secure_url: uploadResponse.secure_url,
        public_id: uploadResponse.public_id,
      };
    } catch (error) {
      console.error('UploadAvatar Error:', error);
      throw error;
    }
  };

  // Middleware to dynamically handle file fields
  const dynamicFileUpload = (req, res, next) => {
    const fields = [];
  
    // Collect all file fields dynamically
    Object.keys(req.body).forEach((key) => {
      if (key.startsWith('variants[') && key.endsWith('][images]')) {
        fields.push({ name: key, maxCount: 3 }); // Adjust maxCount as needed
      }
    });
  
    // If no fields for images are found, skip upload middleware
    if (fields.length === 0) return next();
  
    // Re-initialize Multer with dynamic fields
    const uploadMiddleware = multer({ storage: memoryStorage, limits: { fileSize: 10 * 1024 * 1024 } }).fields(fields);
    uploadMiddleware(req, res, next);
  };

  const uploadProductImages = async (file, existingPublicId) => {
    try {
      if (existingPublicId) {
        const deleteResponse = await cloudinary.uploader.destroy(existingPublicId);
        if (deleteResponse.result !== 'ok') {
          throw new Error(`Failed to delete image with public_id ${existingPublicId}`);
        }
      }
  
      const uploadResponse = await new Promise((resolve, reject) => {
        sharp(file.buffer)
          .resize({ width: 600, height: 600, fit: sharp.fit.inside, withoutEnlargement: true })
          .toFormat("jpg")
          .jpeg({ quality: 90 })
          .toBuffer()
          .then(processedBuffer => {
            cloudinary.uploader.upload_stream(
              { folder: "MyNewApp/ProductPics", format: "jpg" },
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(result);
                }
              }
            ).end(processedBuffer);
          })
          .catch(reject);
      });
  
      return {
        secure_url: uploadResponse.secure_url,
        public_id: uploadResponse.public_id,
      };
    } catch (error) {
      console.error('UploadProductImages Error:', error);
      throw error;
    }
  };

  const uploadImage = async (file, existingPublicId) => {
    try {
        if (existingPublicId) {
            const deleteResponse = await cloudinary.uploader.destroy(existingPublicId);
            if (deleteResponse.result !== 'ok') {
                throw new Error(`Failed to delete image with public_id ${existingPublicId}`);
            }
        }

        // Generate a unique filename using current timestamp or UUID
        const uniqueFilename = `${Date.now()}-${file.originalname.split('.')[0]}`;

        const buffer = await sharp(file.buffer)
            .resize({ width: 600, height: 600, fit: sharp.fit.inside, withoutEnlargement: true })
            .toFormat('jpg')
            .jpeg({ quality: 90 })
            .toBuffer();

        const uploadResponse = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { folder: 'MyNewApp/ProductPics', public_id: uniqueFilename, format: 'jpg' },
                (error, result) => {
                    if (error) {
                        reject('upload error',error);
                    } else {
                        resolve(result);
                    }
                }
            ).end(buffer);
        });

        return {
            secure_url: uploadResponse.secure_url,
            public_id: uploadResponse.public_id,
        };
    } catch (error) {
        throw error;
    }
};
export {
  uploadPhoto,
  uploadPhotoArray,
  uploadImage,
  dynamicFileUpload, 
  uploadBrandLogo,
  processImages,
  handleFileSizeError,
  uploadAvatar,
  uploadCategoryPic,
  uploadProductImages
};
