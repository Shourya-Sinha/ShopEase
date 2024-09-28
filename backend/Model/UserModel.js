import mongoose from "mongoose";
import isDisposableEmail from "../Utills/DispozableEmailList.js";
import moment from "moment";
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const localTime= moment()
const newTime = localTime.format('YYYY-MM-DD HH:mm:ss');

const cloudinaryUrlRegex = /^https:\/\/res\.cloudinary\.com\/[a-zA-Z0-9_-]+\/image\/upload\/v\d+\/[a-zA-Z0-9_\/-]+\.jpg$/;
const cloudinaryPublicIdRegex = /^[a-zA-Z0-9_\/-]+$/;
const otpRegex = /^[A-Z0-9]{6,8}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const restrictedUsernames = [
  'user', 'admin', 'test', 'guest', 'root', 'superuser', 'support', 'info', 'contact',
  'help', 'webmaster', 'administrator', 'manager', 'moderator', 'dev', 'developer',
  'owner', 'account', 'service', 'sysadmin', 'system', 'staff', 'sales', 'service',
  'ceo', 'cfo', 'coo', 'cto', 'it', 'team', 'security', 'billing',
  'finance', 'legal', 'public', 'public-relations', 'press', 'news', 'newsletter',
  'updates', 'alerts', 'notifications', 'announcement',
  'xyz', 'xxx', 'yyy', 'tuv', 'abc', 'def', 'ghi', 'jkl', 'mno', 'pqr', 'stu', 'vwx', 'yz', 'qwe', 'asd', 'zxc', 
  '123', '456', '789', '000', '999', '111', '222', '333', '444', '555', '666', '777', '888'
];

// Adding "user1" to "user100"
for (let i = 1; i <= 100; i++) {
  restrictedUsernames.push(`user${i}`);
}

const containsRestrictedKeyword = (username) => {
  return restrictedUsernames.some(restricted => username.includes(restricted));
};

const isRestrictedUsername = (email) => {
  const username = email.split('@')[0].toLowerCase();
  return containsRestrictedKeyword(username);
};

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required:[true,'First Name is Required'],
    minlength: [3,'FirstName must be atleast 3 characters length'],
    maxlength: [30,'FirstName must be atmost 30 characters length'],
    trim:true,
    match: [/^[a-zA-Z\s]+$/, 'First Name can only contain alphabets and spaces'],
    validate:{
        validator:function(value){
            return value.toLowerCase() !== 'admin';
        },
        message: 'First Name should not be "Admin" Invalid FirstName'
    }
  },
  lastName: {
    type: String,
    required:[true,'Last Name is Required'],
    minlength: [3,'Last Name must be atleast 3 characters length'],
    maxlength: [30,'Last Name must be atmost 30 characters length'],
    trim:true,
    match: [/^[a-zA-Z\s]+$/, 'Last Name can only contain alphabets and spaces'],
    validate:{
        validator:function(value){
            return value.toLowerCase() !== 'admin';
        },
        message: 'Last Name should not be "Admin" Invalid LastName'
    }
  },
email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: [
        {
          validator: function (email) {
            const isValid = emailRegex.test(email);
            return isValid;
          },
          message: (props) => `Provided email (${props.value}) is invalid`,
        },
        {
          validator: function (email) {
            const isDisposable = isDisposableEmail(email);
            return !isDisposable;
          },
          message:(props) => `Disposable email addresses ${props.value} are not allowed`,
        },
        {
          validator: function (email) {
            const isRestricted = isRestrictedUsername(email);
            return !isRestricted;
          },
          message:(props) => `Restricted Word use in email ${props.value} are not allowed`,
        }
      ],
  },
  password:{
    type: String,
    required: [true,'Password is Required'],
    minlength: [8,'Password must be atleast 8 characters length'],
    validate:{
        validator:function(value){
            const hasNumber = /\d/.test(value);
            const hasLowercase = /[a-z]/.test(value);
            const hasUppercase = /[A-Z]/.test(value);
            const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

            return hasNumber && hasLowercase && hasUppercase && hasSpecialChar;
        },
        message:(props)=> `Password must contain at least one number, one lowercase letter, one uppercase letter, and one special character This is${props.value} invalid Password`
    }
  },
  passwordExpiry:{
    type: Date,
  },
  paddwordChangesdAt:{
    type: Date,
  },
  passwordResetToken: {
    type: String,
    validate: {
      validator: function(value) {
        return /^[a-fA-F0-9]{64}$/.test(value); // Example token pattern
      },
      message: 'Invalid password reset token format'
    }
  },
  passresetTokenExpiresAt:{
    type: Date,
  },
  isVerified:{
    type: Boolean,
    default: false,
  },
  otp: {
    type: String,
    validate: {
      validator: function (value) {
        // Validate OTP only if it's present
        return !value || otpRegex.test(value);
      },
      message: (props) => `OTP must be between 6 to 8 characters long and contain only uppercase letters and numbers. (${props.value}) is invalid!`,
    },
  },
  otpExpiryTime:{
    type: Date,
  },
  avatar: {
    secure_url: {
      type: String,
      validate: {
        validator: function(value) {
          return cloudinaryUrlRegex.test(value);
        },
        message: (props) => `Invalid URL format for secure_url ${props.value}`
      }
    },
    public_id: {
      type: String,
      validate: {
        validator: function(value) {
          return cloudinaryPublicIdRegex.test(value);
        },
        message: (props) => `Invalid public_id format ${props.value}`
      }
    }
  },
  dateOfBirth:{
    type: Date,
    validate:{
        validator: function(value){
            const today = moment().toDate();
            return value <= today;
        },
        message: 'Date of Birth must be a valid past date'
    },
  },
  phoneNo:{
    type: String,
    required:[true,'Phone Number is Required'],
    minlength: [10,'Phone Number must be atleast 10 digits long'],
    maxlength: [13,'Phone Number must be atmost 13 digits long'],
    validate:{
        validator: function(value) {
            return /^\+?[1-9]\d{9,14}$/.test(value);
        },
        message: 'Invalid Phone Number Cannot use This Type or Serial Number as Phone Number'
    }
  },
  gender:{
    type: String,
    enum: ['Male', 'Female', 'Other'],
  },
  address:{
    type:mongoose.Schema.Types.ObjectId,
    ref: 'Address',
  },
  role:{
    type: String,
    enum: ['Admin', 'User'],
    default: 'User'
  },
  wishlist:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  }],
  createdAt:{
    type: Date,
    default: new Date(),
  },
  updatedAt:{
    type: Date,
    default: new Date(),
    select: false,
  },
  deviceId: {
    type: String,
    required: [true, 'Device ID is required']
},
    sessions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Session' }],
    currentSession: {
        type: String,
        default: null
    },
    isBlocked:{
        type: Boolean,
        default: false
    }
});

userSchema.methods.addDevice = function (deviceId, ip) {
    const deviceIndex = this.devices.findIndex(device => device.deviceId === deviceId);
    if (deviceIndex === -1) {
      // New device
      this.devices.push({ deviceId, ip, lastLogin: new Date() });
    } else {
      // Existing device
      this.devices[deviceIndex].lastLogin = new Date();
      this.devices[deviceIndex].ip = ip;
    }
    
    // Remove old devices if you want to limit the number of devices
    this.devices = this.devices.slice(-2); // Keep only the latest 5 devices, for example
  };
  
  userSchema.methods.removeDevice = function (deviceId) {
    this.devices = this.devices.filter(device => device.deviceId !== deviceId);
  };

userSchema.pre('save', async function(next) {
    if (this.isModified('password') && this.password) {
      this.password = await bcrypt.hash(this.password.toString(), 12);
  
      this.passwordExpiry = moment().add(60, 'days').toDate();
  
      this.passwordChangedAt = new Date();
    }
    next();
  });
userSchema.pre('save', async function (next) {
    // Only run if OTP was actually modified and is not null
    if (this.isModified('otp') && this.otp) {
      // Validate OTP before hashing
      if (!otpRegex.test(this.otp)) {
        return next(new Error('Invalid OTP format'));
      }
  
      // Hash the OTP
      this.otp = await bcrypt.hash(this.otp.toString(), 12);
    }
  
    next();
  });

// checking password expiry time // Method to check if the password is expired
userSchema.methods.isPasswordExpired = function() {
    if (!this.passwordExpiry) {
      return false; // If no passwordExpiry, consider it not expired
    }
    const isExpired = moment().isAfter(this.passwordExpiry);
    return isExpired;
  };

// Method to compare candidate password with stored hashed password
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};
  
  // Method to check if the password was changed after a given timestamp
  userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
      const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
      return JWTTimestamp < changedTimestamp;
    }
    return false;
  };

  //Method to compare candidate OTP with stored hashed OTP
  userSchema.methods.correctOtp = async function(candidateOtp, userOtp) {
    return await bcrypt.compare(candidateOtp, userOtp);
  };
  
  // Method to check if the OTP is expired
  userSchema.methods.isOtpExpired = function() {
    return moment().isAfter(this.otpExpiryTime);
  };

  userSchema.methods.createPasswordResetToken = function() {
    // Generate a random token
    const resetToken = crypto.randomBytes(32).toString('hex');
  
    // Hash the token and set it to passwordResetToken
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    return resetToken;
  };

const User = mongoose.model('User',userSchema);

export default User;
