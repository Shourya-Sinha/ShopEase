import Address from "../Model/AddressModel.js";
import User from "../Model/UserModel.js";
import AppError from "../Utills/AppError.js";

const addAddress = async (req,res,next)=>{
    try {
        const addressData = req.body;
        const { id } = req.user;
    
        const user = await User.findById(id);
        if (!user) {
        return res.status(404).json({
            status: 'error',
            message: 'User not found',
        });
        }
    
        // If the new address is set as default, unset the default for all other addresses
        if (addressData.isDefault) {
        await Address.updateMany({ user: user._id, isDefault: true }, { isDefault: false });
        }
    
        const address = new Address({ ...addressData, user: user._id });
        await address.save();
    
        return res.status(200).json({
        status: 'success',
        message: 'Address added successfully',
        data: address,
        });
    } catch (error) {
        return next(new AppError(500,'error',error.message));
    }
};

//Update Address

const updateAddress = async (req, res,next) => {
try {
    const { addressData } = req.body;
    const { id } = req.user;
    const { addressId } = req.params;

    if (!addressData) {
        return next(new AppError(500,'error',error.message));
    }

    // Check if the user exists
    const user = await User.findById(id);
    if (!user) {
        return next(new AppError(400,'error','User not found'));
    }

    // Check if the address exists
    const address = await Address.findById(addressId);
    if (!address) {
        return next(new AppError(404,'error','Address not found'));
    }

    // Update the address
    const newAddress = await Address.findByIdAndUpdate(addressId, addressData, { new: true });

    return res.status(200).json({
        status: 'success',
        message: 'Address updated successfully',
        data: newAddress,
    });
} catch (error) {
    return next(new AppError(500,'error',error.message));
}
};

//Get All Address
const getAllAddress = async (req,res)=>{
try {
    const {id} = req.user;
    const user = await User.findById(id);
    if(!user){
        return next(new AppError(404,'error','User not found'));
    }
    const address = await Address.find({user:user._id});
    return res.status(200).json({
        status:'success',
        message: 'Addresses fetched successfully',
        data: address
    });
} catch (error) {
    return next(new AppError(500,'error',error.message));
}
};

//Delete Address
const deleteAAddress = async (req,res)=>{
try {
    const {id} = req.user;
    //const addressId = req.params;
    const addressId = req.params.id;
    const user = await User.findById(id);
    if(!user){
        return next(new AppError(404,'error','User not found'));
    }
    const address = await Address.findByIdAndDelete(addressId);
    if(!address){
        return next(new AppError(404,'error','Address not found'));
    }
    return res.status(200).json({
        status:'success',
        message: 'Address deleted successfully',
    });
} catch (error) {
    return next(new AppError(500,'error',error.message));
}
};

const changeDefaultState = async (req, res) => {
    try {
        const { id } = req.user; // User ID
        const { addressId } = req.params; // Address ID to be set as default

        // Find the user
        const user = await User.findById(id);
        if (!user) {
            return next(new AppError(404,'error','User not found'));
        }

        // Check if the address exists
        const addressToUpdate = await Address.findById(addressId);
        if (!addressToUpdate) {
            return next(new AppError(404,'error','Address not found'));
        }

        // Check if any address is currently default for the user
        const currentDefaultAddress = await Address.findOne({
            user: user._id,
            isDefault: true,
            _id: { $ne: addressId } // Exclude the address to be updated
        });

        if (currentDefaultAddress) {
            // Unset the default status for the current default address
            await Address.updateMany(
                { user: user._id, isDefault: true },
                { $set: { isDefault: false } }
            );
        }

        // Set the target address as default
        const newAddress = await Address.findByIdAndUpdate(
            addressId,
            { isDefault: true },
            { new: true }
        );

        return res.status(200).json({
            status: 'success',
            message: 'This Address set to Default successfully',
            data: newAddress._id,
        });
    } catch (error) {
        return next(new AppError(500,'error',error.message));
    }
};

export {addAddress,deleteAAddress,updateAddress,getAllAddress,changeDefaultState};