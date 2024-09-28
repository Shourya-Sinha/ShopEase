import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel',
        required: true,
      },
      alternateNo: {
        type: String,
      },
      country: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      zipCode: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      nearby:{
        type: String,
        required: true,
      },
      apartment: {
        type: String,
      },
      isDefault: {
        type: Boolean,
        default: false,
      },
      shippingAddress:{
        fullName:{
          type: String,
          required: true
        },
        email:{
          type: String,
          required: true
        },
        phoneNo:{
          type: String,
          required: true
        },
        alternateNo:{
          type: String,
        },
        address:{
          type: String,
          required: true
        }
      }
}, { timestamps: true });

const Address = mongoose.model('Address',addressSchema)

export default Address;