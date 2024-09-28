import User from "../Model/UserModel.js";
import moment from "moment";
import otpGenerator from "otp-generator";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import AppError from "../Utills/AppError.js";
import filterObj from "../Utills/FilterData.js";
import sendMail from "../Utills/Mailer.js";
import generateDeviceId from "../Utills/DeviseId.js";
import BlacklistedToken from "../Model/BlackListedToken.js";
import Session from "../Model/SessionModel.js";
import { uploadAvatar } from "../MiddleWares/UploadImages.js";
import Product from "../Model/ProductModel.js";
import Cart from "../Model/CartModel.js";
import mongoose from "mongoose";
import Coupon from "../Model/CouponModel.js";
import Order from "../Model/OrderModel.js";
import Payment from "../Model/PaymentModel.js";

//const signToken = (userId) => jwt.sign({ userId }, process.env.JWT_SECRET);
const signToken = (userId) => {
  // Specify the expiration time, e.g., '1h' for one hour
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "20h", // Default to 1 hour if not set in the environment variable
  });
};

const blacklistToken = async (token) => {
  try {
    await BlacklistedToken.create({ token });
  } catch (error) {
    console.error("Error blacklisting token:", error);
  }
};

const isTokenBlacklisted = async (token) => {
  try {
    const tokenExists = await BlacklistedToken.findOne({ token });
    return !!tokenExists;
  } catch (error) {
    console.error("Error checking token blacklist:", error);
    return false;
  }
};

const registerUser = async (req, res, next) => {
  const localTime = moment();

  try {
    const { firstName, lastName, email, password, phoneNo } = req.body;

    const filteredBody = filterObj(
      req.body,
      "firstName",
      "lastName",
      "email",
      "password",
      "phoneNo"
    );

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.isVerified) {
        return next(
          new AppError(400, "error", "Email already verified. Please Login.")
        );
      } else {
        return next(
          new AppError(
            400,
            "error",
            "You are a registered user but not verified. Please verify your email or use another email."
          )
        );
      }
    }

    // Create a new user
    const currentDeviceId = generateDeviceId();
    const newUser = await User.create({
      ...filteredBody,
      createdAt: localTime,
      updatedAt: null,
      deviceId: currentDeviceId,
    });
    await Session.create({
      userId: newUser._id,
      deviceId: currentDeviceId,
      ipAddress: req.ip,
      token: "",
      isActive: true,
      createdAt: moment().toDate(),
    });
    req.userId = newUser._id; // Correctly setting the user ID on the request object

    next();
  } catch (error) {
    if (error.name === "ValidationError") {
      // Handle validation error by sending a response with the error details
      return res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
    return next(new AppError(500, "error", error.message)); // Correctly passing the error to the global error handler
  }
};

const sendOtp = async (req, res, next) => {
  const localTime = moment();
  const newTime = localTime.add(10, "minutes").toDate();
  try {
    const userId = req.userId; // Correctly retrieving the user ID from the request object
    const user = await User.findById(userId);

    if (user.isBlocked) {
      return next(
        new AppError(400, "error", "You Are Blocked Please Contact to Support")
      );
    }

    if (!user) {
      return next(new AppError(404, "error", "User not found."));
    }

    const otp = otpGenerator.generate(6, {
      digits: true,
      upperCaseAlphabets: true,
      specialChars: false,
      lowerCaseAlphabets: false,
    });

    user.otpExpiryTime = newTime;
    user.otp = otp;

    await user.save({ new: true, validateModifiedOnly: true });

    // Send an email
    const emailData = {
      recipient: user.email,
      sender: "shouryasinha.c@gmail.com",
      subject: "Verification OTP",
      html: `<p>This OTP is valid only for 10 minutes: ${otp}</p>`,
    };

    await sendMail(emailData);

    return res.status(200).json({
      status: "success",
      message: "OTP sent successfully for Verification",
    });
  } catch (error) {
    return next(new AppError(500, "error", error.message));
  }
};

const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email }).select("otp otpExpiryTime");

    if (!user) {
      return next(new AppError(404, "error", "User not found."));
    }

    if (user.isOtpExpired()) {
      return next(new AppError(400, "error", "OTP expired."));
    }

    if (!otp) {
      return next(new AppError(400, "error", "OTP is required."));
    }

    // Compare OTP
    const isValidOtp = await user.correctOtp(otp, user.otp);

    if (!isValidOtp) {
      return next(new AppError(400, "error", "Invalid OTP."));
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiryTime = null;
    await user.save();

    return res.status(200).json({
      status: "success",
      message: "Email verified successfully",
    });
  } catch (error) {
    return next(new AppError(500, "error", error.message));
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(
        new AppError(400, "error", "Email and password are required.")
      );
    }

    const user = await User.findOne({ email }).select("+password");

    if (user.isBlocked) {
      return next(
        new AppError(400, "error", "You Are Blocked Please Contact to Support")
      );
    }

    if (!user) {
      return next(new AppError(401, "error", "Incorrect email."));
    }

    const isCorrectPassword = await user.correctPassword(
      password,
      user.password
    );
    if (!isCorrectPassword) {
      return next(new AppError(401, "error", "Incorrect password."));
    }

    if (user.isPasswordExpired()) {
      return next(
        new AppError(
          401,
          "error",
          "Password expired. Please reset your password."
        )
      );
    }

    const token = signToken(user._id);

    const cookieExpiresIn = process.env.JWT_COOKIE_EXPIRES_IN;
    const cookieExpiryDate = moment().add(cookieExpiresIn, "days").toDate();

    // Use the stored device ID for session management
    const currentDeviceId = user.deviceId;
    const ipAddress = req.ip;

    // Find an existing session for the device ID
    let existingSession = await Session.findOne({ deviceId: currentDeviceId });

    if (existingSession) {
      // Invalidate the old session token
      await blacklistToken(existingSession.token);

      // Update the existing session
      existingSession.token = token;
      existingSession.ipAddress = ipAddress;
      existingSession.createdAt = new Date();
      existingSession.isActive = true;
      await existingSession.save();

      // Ensure the session ID is only added once
      if (!user.sessions.includes(existingSession._id)) {
        user.sessions.push(existingSession._id);
      }
    } else {
      // Create a new session if it doesn't exist
      const newSession = await Session.create({
        deviceId: currentDeviceId,
        ipAddress,
        isActive: true,
        token: token,
        createdAt: moment().toDate(),
      });
      user.sessions.push(newSession._id);
    }

    // Invalidate any other sessions for this device ID
    await Session.updateMany(
      { deviceId: currentDeviceId, token: { $ne: token } },
      { $set: { isActive: false } }
    );
    user.currentSession = token;
    await user.save();

    res.cookie("refreshToken", token, {
      expires: cookieExpiryDate,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    });

    return res.status(200).json({
      status: "success",
      message: "Login successful",
      token,
      data: {
        user: user._id,
        name: user.firstName + " " + user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    return next(new AppError(500, "error", error.message));
  }
};

const protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.refreshToken) {
      token = req.cookies.refreshToken;
    }

    if (!token) {
      return next(
        new AppError(
          401,
          "error",
          "You are not logged in! Please log in to get access."
        )
      );
    }

    const blacklistedtoken = await BlacklistedToken.findOne({ token });
    if (blacklistedtoken) {
      return next(
        new AppError(
          401,
          "error",
          "Your session has been expired. Please log in again."
        )
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const now = Math.floor(Date.now() / 1000); // Current time in seconds

    if (decoded.exp < now) {
      return next(
        new AppError(401, "error", "Token has expired. Please log in again.")
      );
    }

    const currentUser = await User.findById(decoded.userId);
    if (!currentUser) {
      return next(
        new AppError(
          401,
          "error",
          "User no longer exists with this token. Please log in again."
        )
      );
    }

    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError(
          401,
          "error",
          "User recently changed password! Please log in again."
        )
      );
    }

    req.user = currentUser;
    req.userId = currentUser.id;
    next();
  } catch (error) {
    return next(
      new AppError(401, "error", "Invalid token or token has expired.")
    );
  }
};

const sendTokenForForgotPassowrd = async (req, res, next) => {
  let user;
  const localTime = moment();
  const newTime = localTime.format("YYYY-MM-DD HH:mm:ss");
  try {
    // 1 get user from email
    user = await User.findOne({ email: req.body.email });

    if (!user) {
      return next(new AppError(404, "error", "User not found."));
    }

    if (user.isBlocked) {
      return next(
        new AppError(400, "error", "You Are Blocked Please Contact to Support")
      );
    }

    // 2 generate reset token
    const resetToken = user.createPasswordResetToken();
    user.passresetTokenExpiresAt = moment().add(10, "minutes").toDate();
    await user.save({ validateModifiedOnly: true });
    // 3 send reset token via email
    // const resetUrl = `http://localhost:3000/auth/new-password?token=${resetToken}`;
    const resetUrl = `http://localhost:5173/new-password?token=${resetToken}`;
    const emailData = {
      recipient: user.email,
      sender: "shouryasinha.c@gmail.com",
      subject: "Password Reset",
      html: `<p>You requested a password reset. Please click <a href='${resetUrl}'>here</a> to reset your password.</p>`,
    };
    await sendMail(emailData);
    return res.status(200).json({
      status: "success",
      message:
        "Reset password email sent successfully. Please check your inbox.",
    });
  } catch (error) {
    return next(new AppError(500, "error", error.message));
  }
};

// const resetPassowrdforToken = async (req, res, next) => {
//   try {
//     const { password, confirmPassword, token } = req.body;

//     // Ensure both password fields are provided and match
//     if (!password || !confirmPassword) {
//       return next(
//         new AppError(
//           400,
//           "error",
//           "Password and confirm password are required."
//         )
//       );
//     }
//     if (password !== confirmPassword) {
//       return next(new AppError(400, "error", "Both Passwords do not match."));
//     }

//     // Hash the token to find the user in the database
//     const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

//     // Find user by the hashed token and check token expiry
//     const user = await User.findOne({
//       passwordResetToken: hashedToken,
//       passresetTokenExpiresAt: { $gt: moment().toDate() },
//     });

//     // If user not found or token expired
//     if (!user) {
//       return next(
//         new AppError(
//           404,
//           "error",
//           "Invalid or expired resetToken. Please request a new one."
//         )
//       );
//     }

//     // Reset the password and clear reset token fields
//     user.password = password;
//     user.passwordResetToken = undefined;
//     user.passresetTokenExpiresAt = undefined;
//     await user.save({ validateModifiedOnly: true });

//     // Invalidate old sessions
//     // for (const sessionId of user.sessions) {
//     //   await Session.findByIdAndUpdate(sessionId, { isActive: false });
//     // }

//     // Create a new session with a refresh token
//     const refreshtoken = signToken(user._id);
//     const newSession = await Session.create({
//       deviceId: generateDeviceId(),
//       token: refreshtoken,
//       ipAddress: req.ip,
//       isActive: true,
//     });

//     // Link new session to the user
//     user.sessions.push(newSession._id);
//     await user.save();

//     return res.status(200).json({
//       status: "success",
//       message: "Password reset successful. Please log in.",
//       token: refreshtoken,
//     });
//   } catch (error) {
//     return next(new AppError(500, "error", error.message));
//   }
// };


// const resetPassowrdforToken = async (req, res, next) => {
//   try {
//     const { password, confirmPassword, token } = req.body;

//     // Check for required fields
//     if (!password || !confirmPassword) {
//       return next(new AppError(400, "error", "Password and confirm password are required."));
//     }
//     if (password !== confirmPassword) {
//       return next(new AppError(400, "error", "Both passwords do not match."));
//     }

//     // 1. Get user from saved token
//     const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

//     const user = await User.findOne({
//       passwordResetToken: hashedToken,
//       passresetTokenExpiresAt: { $gt: moment().toDate() },
//     });

//     // 2. If user is not found
//     if (!user) {
//       return next(new AppError(404, "error", "Invalid or expired reset token. Please send email again."));
//     }

//     // 3. Update password
//     user.password = password; // Ensure you hash the password here if required
//     user.passwordResetToken = undefined; // Clear reset token
//     user.passresetTokenExpiresAt = undefined; // Clear expiration date
//     await user.save({ validateModifiedOnly: true });

//     // Invalidate old sessions
//     for (const sessionId of user.sessions) {
//       await Session.findByIdAndUpdate(sessionId, { isActive: false });
//     }

//     // Create new session
//     const refreshToken = signToken(user._id); // Get userId from user object
//     const newSession = await Session.create({
//       deviceId: generateDeviceId(),
//       token: refreshToken,
//       ipAddress: req.ip,
//       isActive: true,
//     });

//     // Add the new session to the user
//     user.sessions.push(newSession._id);
//     await user.save();

//     return res.status(200).json({
//       status: "success",
//       message: "Password reset successful. Please log in.",
//       token: refreshToken,
//     });
//   } catch (error) {
//     return next(new AppError(500, "error", error.message));
//   }
// };
// const resetPassowrdforToken = async (req, res, next) => {
//   try {
//     const { password, confirmPassword, token } = req.body;

//     // Check for required fields
//     if (!password || !confirmPassword) {
//       return next(new AppError(400, "error", "Password and confirm password are required."));
//     }
//     if (password !== confirmPassword) {
//       return next(new AppError(400, "error", "Both passwords do not match."));
//     }

//     // 1. Get user from saved token
//     const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

//     const user = await User.findOne({
//       passwordResetToken: hashedToken,
//       passresetTokenExpiresAt: { $gt: moment().toDate() },
//     });

//     // 2. If user is not found
//     if (!user) {
//       return next(new AppError(404, "error", "Invalid or expired reset token. Please send email again."));
//     }

//     // 3. Update password
//     user.password = password; // Ensure you hash the password here if required
//     user.passwordResetToken = undefined; // Clear reset token
//     user.passresetTokenExpiresAt = undefined; // Clear expiration date
//     await user.save({ validateModifiedOnly: true });

//     // Invalidate old sessions
//     for (const sessionId of user.sessions) {
//       await Session.findByIdAndUpdate(sessionId, { isActive: false });
//     }

//     // Create new session
//     const refreshToken = signToken(user._id); // Use user._id to get the user ID
//     const newSession = await Session.create({
//       deviceId: generateDeviceId(), // Ensure you have a function to generate a device ID
//       token: refreshToken,
//       ipAddress: req.ip,
//       isActive: true,
//     });

//     // Add the new session to the user
//     user.sessions.push(newSession._id);
//     await user.save();

//     return res.status(200).json({
//       status: "success",
//       message: "Password reset successful. Please log in.",
//       token: refreshToken,
//     });
//   } catch (error) {
//     return next(new AppError(500, "error", error.message));
//   }
// };
const resetPassowrdforToken = async (req, res, next) => {
  try {
    const { password, confirmPassword, token } = req.body;

    // Check for required fields
    if (!password || !confirmPassword) {
      return next(new AppError(400, "error", "Password and confirm password are required."));
    }
    if (password !== confirmPassword) {
      return next(new AppError(400, "error", "Both passwords do not match."));
    }

    // 1. Get user from saved token
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passresetTokenExpiresAt: { $gt: moment().toDate() },
    });

    // 2. If user is not found
    if (!user) {
      return next(new AppError(404, "error", "Invalid or expired reset token. Please send email again."));
    }

    // 3. Update password
    user.password = password; // Ensure you hash the password here if required
    user.passwordResetToken = undefined; // Clear reset token
    user.passresetTokenExpiresAt = undefined; // Clear expiration date
    await user.save({ validateModifiedOnly: true });
    console.log("User ID:", user._id);
    console.log("Token:", token);
    
    // Invalidate old sessions
    for (const sessionId of user.sessions) {
      await Session.findByIdAndUpdate(sessionId, { isActive: false });
    }

    // Create new session
    const refreshToken = signToken(user._id); // Use user._id to get the user ID
    const newSession = await Session.create({
      deviceId: generateDeviceId(), // Ensure you have a function to generate a device ID
      token: refreshToken,
      ipAddress: req.ip,
      isActive: true,
      userId: user._id // Ensure userId is set here
    });

    // Add the new session to the user
    user.sessions.push(newSession._id);
    await user.save();

    return res.status(200).json({
      status: "success",
      message: "Password reset successful. Please log in.",
      token: refreshToken,
    });
  } catch (error) {
    console.error("Error in resetPassowrdforToken:", error); // Log the error for debugging
    return next(new AppError(500, "error", error.message));
  }
};


const invalidateSessions = async (user) => {
  try {
    // Find all active sessions for the user
    const sessions = await Session.find({ userId: user._id, isActive: true });

    // Blacklist tokens and mark sessions as inactive
    for (const session of sessions) {
      //await blacklistToken(existingSession.token);
      await blacklistToken(session.token);
      session.isActive = false;
      await session.save();
    }

  } catch (error) {
    console.error("Error invalidating sessions:", error);
    return next(new AppError(400, "error", error.message));
  }
};
// update user
const updatedUser = async (req, res, next) => {
  try {
    const id = req.userId;

    const user = await User.findById(id);

    if (user.isBlocked) {
      return next(
        new AppError(400, "error", "You Are Blocked Please Contact to Support")
      );
    }

    if (!user) {
      return next(new AppError(404, "error", "User not found."));
    }
    // update user
    const {
      firstName,
      lastName,
      email,
      dateOfBirth,
      phoneNo,
      gender,
      currentPassword,
    } = req.body;

    if (email) {
      if (
        !currentPassword ||
        !(await user.correctPassword(currentPassword, user.password))
      ) {
        return next(
          new AppError(
            401,
            "error",
            "Current password is required to update email. or Incorrect Password"
          )
        );
      }
      user.email = email;

      await user.f;

      await invalidateSessions(user);
    }
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (gender) user.gender = gender;
    if (phoneNo) user.phoneNo = phoneNo;
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;

    // Process and upload profile picture
    if (req.file) {
      const existingPublicId = user.avatar ? user.avatar.public_id : null; // Retrieve existing public_id
      const avatar = await uploadAvatar(req.file, existingPublicId); // Pass the existing public_id to delete it
      user.avatar = avatar; // Update with new avatar data
    }

    user.updatedAt = moment().toDate();

    await user.save();
    return res.status(200).json({
      status: "success",
      message: "User updated successfully.",
      data: user,
    });
  } catch (error) {
    return next(new AppError(500, "error", error.message));
  }
};
const logoutUser = async (req, res, next) => {
  try {
    const id = req.userId;
    const user = await User.findById(id);
    if (!user) {
      return next(new AppError(404, "error", "User not found."));
    }

    // Get the current token from headers or cookies
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    const session = await Session.findOneAndUpdate(
      { userId: id, isActive: true },
      { isActive: false, token: null }, // Set isActive to false and remove token
      { new: true }
    );

    if (!session) {
      return next(
        new AppError(404, "error", "Session not found or already inactive.")
      );
    }

    await BlacklistedToken.create({ token });

    // Optionally, clear the cookie
    res.cookie("refreshToken", "", { expires: new Date(0), httpOnly: true });

    return res.status(200).json({
      status: "success",
      message: "Logged out successfully.",
    });
  } catch (error) {
    return next(new AppError(500, "error", error.message));
  }
};

//ADMIN

//admin Login
const getAllOrdersForAdmin= async(req,res,next)=>{
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user && user.role !== 'Admin') {
      return next(new AppError(404, "error", "User not found. OR you are not authorise to do this"));
    }

    const orders = await Order.find().populate('items.product').populate('items.selectedColour');
    if (!orders) {
      return next(new AppError(404, "error", "No orders found."));
    }
    return res.status(200).json({
      status: "success",
      message: "All Orders",
      data: orders,
    });
  } catch (error) {
    return next(new AppError(500, "error", error.message));
  }
}

const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(
        new AppError(400, "error", "Email and password are required.")
      );
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new AppError(401, "error", "Incorrect email."));
    }

    if (user.role !== "Admin") {
      return next(
        new AppError(
          401,
          "error",
          "You are not an admin. You can not access this Path"
        )
      );
    }

    const isCorrectPassword = await user.correctPassword(
      password,
      user.password
    );
    if (!isCorrectPassword) {
      return next(new AppError(401, "error", "Incorrect password."));
    }

    if (user.isPasswordExpired()) {
      return next(
        new AppError(
          401,
          "error",
          "Password expired. Please reset your password."
        )
      );
    }
    const token = signToken(user._id);

    const cookieExpiresIn = process.env.JWT_COOKIE_EXPIRES_IN;
    const cookieExpiryDate = moment().add(cookieExpiresIn, "days").toDate();

    // Use the stored device ID for session management
    const currentDeviceId = user.deviceId;
    const ipAddress = req.ip;

    // Find an existing session for the device ID
    let existingSession = await Session.findOne({ deviceId: currentDeviceId });

    if (existingSession) {
      // Invalidate the old session token
      await blacklistToken(existingSession.token);

      // Update the existing session
      existingSession.token = token;
      existingSession.ipAddress = ipAddress;
      existingSession.createdAt = new Date();
      existingSession.isActive = true;
      await existingSession.save();

      // Ensure the session ID is only added once
      if (!user.sessions.includes(existingSession._id)) {
        user.sessions.push(existingSession._id);
      }
    } else {
      // Create a new session if it doesn't exist
      const newSession = await Session.create({
        deviceId: currentDeviceId,
        ipAddress,
        isActive: true,
        token: token,
        createdAt: moment().toDate(),
      });
      user.sessions.push(newSession._id);
    }

    // Invalidate any other sessions for this device ID
    await Session.updateMany(
      { deviceId: currentDeviceId, token: { $ne: token } },
      { $set: { isActive: false } }
    );
    user.currentSession = token;
    await user.save();

    res.cookie("refreshToken", token, {
      expires: cookieExpiryDate,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    });

    return res.status(200).json({
      status: "success",
      message: "Login successful",
      token,
      data: { user: user._id },
    });
  } catch (error) {
    return next(new AppError(500, "error", error.message));
  }
};

//blockUser
const blockUser = async (req, res, next) => {
  try {
    const id = req.body;

    const user = await User.findById(id);

    if (!user) {
      return next(new AppError(404, "error", "User not found."));
    }

    user.isBlocked = true;
    await invalidateSessions(user);
    await user.save();

    return res.status(200).json({
      status: "success",
      message: "User blocked successfully.",
    });
  } catch (error) {
    return next(new AppError(500, "error", error.message));
  }
};

//unblockUser
const unBlockUser = async (req, res, next) => {
  try {
    const id = req.body;

    const user = await User.findById(id);

    if (!user) {
      return next(new AppError(404, "error", "User not found."));
    }

    user.isBlocked = false;
    await user.save();
  } catch (error) {
    return next(new AppError(500, "error", error.message));
  }
};
//getSingleUser
const getSingleUser = async (req, res, next) => {
  try {
    const id = req.body;
    const user = await User.findById(id);

    if (!user) {
      return next(new AppError(404, "error", "User not found."));
    }
    return res.status(200).json({
      status: "success",
      message: "User fetched successfully.",
      data: user,
    });
  } catch (error) {
    return next(new AppError(500, "error", error.message));
  }
};
//getAll User
const getAllUser = async (req, res, next) => {
  try {
    const allUser = await User.find();

    if (!allUser) {
      return next(new AppError(404, "error", "No User Found."));
    }
    return res.status(200).json({
      status: "success",
      message: "All User fetched successfully.",
      data: allUser,
    });
  } catch (error) {
    return next(new AppError(500, "error", error.message));
  }
};
// isAdmin

const isAdmin = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (user.role !== "Admin") {
      return res.status(403).json({
        status: "error",
        message: "You are not authrise to perform this action",
      });
    } else {
      next();
    }
  } catch (error) {
    return next(new AppError(500, "error", error.message));
  }
};
// Remove from wishlist
const removeItemFromWishlist = async (req, res, next) => {
  try {
    const { userId } = req.userId;
    const { productId } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { wishlist: productId } },
      { new: true }
    );

    if (!user) {
      return next(new AppError(404, "error", "User not found."));
    }
    return res.status(200).json({
      status: "success",
      message: "Item removed from wishlist successfully.",
    });
  } catch (error) {
    return next(new AppError(500, "error", error.message));
  }
};

//cART 
const addToCart = async (req, res, next) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) {
      return next(new AppError(404, "error", "User not found."));
    }

    const { productId, selectedColour, quantity, selectedVariant } = req.body;

    const product = await Product.findById(productId).populate('colors');
    if (!product) {
      return next(new AppError(404, "error", "Product not found."));
    }

    const color = product.colors.find((color) =>
      color.color.equals(selectedColour)
    );
    if (!color) {
      return next(new AppError(404, "error", "Selected color not found."));
    }

    const variant = color.variants.find(
      (variant) => variant.name === selectedVariant
    );
    if (!variant) {
      return next(new AppError(404, "error", "Selected variant not found."));
    }

    let cart = await Cart.findOne({ orderBy: userId });

    if (!cart) {
      cart = new Cart({
        orderBy: userId,
        items: [],
        totalPrice: mongoose.Types.Decimal128.fromString("0.00"),
        discountedPrice: mongoose.Types.Decimal128.fromString("0.00"),
        discountAmount: mongoose.Types.Decimal128.fromString("0.00"),
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) =>
        item.product.equals(productId) &&
        item.selectedColour.equals(selectedColour) &&
        item.selectedVariant === selectedVariant
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      const newItem = {
        product: productId,
        selectedColour: selectedColour,
        selectedVariant: selectedVariant,
        quantity,
        price: mongoose.Types.Decimal128.fromString(variant.price.toFixed(2)),
      };
      cart.items.push(newItem);
    }

    cart.totalPrice = cart.calculateTotal();

    if (cart.coupon && cart.coupon.code) {
      const totalPrice = parseFloat(cart.totalPrice.toString());
      const discountAmount = (totalPrice * cart.coupon.discount) / 100;
      cart.discountAmount = mongoose.Types.Decimal128.fromString(
        discountAmount.toFixed(2)
      );
      cart.discountedPrice = mongoose.Types.Decimal128.fromString(
        (totalPrice - parseFloat(cart.discountAmount.toString())).toFixed(2)
      );
    } else {
      cart.discountAmount = mongoose.Types.Decimal128.fromString("0.00");
      cart.discountedPrice = 0;
    }

    await cart.save();

    const populatedCart = await Cart.findById(cart._id)
     

    return res.status(200).json({
      status: "success",
      message: "Item added to cart successfully.",
      data: populatedCart,
    });
  } catch (error) {
    return next(new AppError(500, "error", error.message));
  }
};

//update quantity

const updateCartItemQuantity = async (req, res, next) => {
  try {
    const { productId, selectedColorId, selectedVariantName, requestedQuantity } = req.body;
    const userId = req.userId;

    let cart = await Cart.findOne({ orderBy: userId }).populate({
      path: 'items.product',
    }).populate({
      path: 'items.selectedColour',
      select: 'hexCode title',
    });

    // Check for the cart
    if (!cart) {
      return next(new AppError(404, "error", "Cart not found."));
    }

    // Access the items array directly from the cart
    const cartItem = cart.items.find(item => item.product._id.toString() === productId);
    if (!cartItem) {
      return next(new AppError(404, "error", "Product not found in cart."));
    }

    // Find the selected color (match ObjectId using toString())
    const color = cartItem.product.colors.find(color => color.color.toString() === selectedColorId);
    if (!color) {
      return next(new AppError(404, "error", "Color not found."));
    }

    // Find the selected variant within the color
    const selectedVariant = color.variants.find(variant => variant.name === selectedVariantName);
    if (!selectedVariant) {
      return next(new AppError(404, "error", "Variant not found."));
    }

    // Check available stock
    if (requestedQuantity > selectedVariant.quantity) {
      return next(new AppError(400, "error", "Requested quantity exceeds available stock."));
    }

    // Update the cart item's quantity and the stock
    cartItem.quantity = requestedQuantity;
    selectedVariant.quantity -= requestedQuantity;

    // Save the updated cart
    await cart.save();

    return res.status(200).json({
      status: "success",
      message: "Cart item quantity updated successfully.",
      cart: cart
    });
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
    return next(new AppError(500, "error", error.message));
  }
};

const applyCoupon = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { couponCode } = req.body;

    // Find the new coupon by code
    const newCoupon = await Coupon.findOne({ code: couponCode });
    if (!newCoupon) {
      return next(new AppError(404, "error", "Coupon not found"));
    }

    // Check if the new coupon is active
    if (!newCoupon.isActive) {
      return next(
        new AppError(400, "error", "This coupon is no longer active")
      );
    }

    // Check if the new coupon has expired
    if (new Date() > newCoupon.expirationDate) {
      return next(new AppError(400, "error", "This coupon has expired"));
    }

    // Check if the usage limit for the new coupon has been reached
    if (newCoupon.usageCount >= newCoupon.usageLimit) {
      return next(
        new AppError(400, "error", "This coupon has reached its usage limit")
      );
    }

    // Find the user's cart
    const cart = await Cart.findOne({ orderBy: userId });
    if (!cart) {
      return next(new AppError(404, "error", "Cart not found"));
    }

    // Check if the same coupon is already applied
    if (cart.coupon && cart.coupon.code === couponCode) {
      return next(
        new AppError(
          400,
          "error",
          "This coupon is already applied to your cart."
        )
      );
    }

    // Decrease the usage count of the previous coupon if it exists
    if (cart.coupon && cart.coupon.code) {
      const previousCoupon = await Coupon.findOne({ code: cart.coupon.code });
      if (previousCoupon) {
        previousCoupon.usageCount -= 1;
        await previousCoupon.save();
      }
    }

    // Calculate the discount for the new coupon
    const discountAmount =
      (cart.totalPrice * newCoupon.discountPercentage) / 100;

    // Update the cart with the new coupon
    cart.coupon = {
      code: newCoupon.code,
      discount: newCoupon.discountPercentage,
    };
    cart.discountAmount = mongoose.Types.Decimal128.fromString(
      discountAmount.toFixed(2)
    );
    cart.discountedPrice = mongoose.Types.Decimal128.fromString(
      (cart.totalPrice - parseFloat(cart.discountAmount.toString())).toFixed(2)
    );

    // Increment the usage count for the new coupon and save it
    newCoupon.usageCount += 1;
    await newCoupon.save();

    // Save the cart with the new coupon applied
    await cart.save();

    return res.status(200).json({
      status: "success",
      message: "Coupon applied successfully",
      data: cart,
    });
  } catch (error) {
    return next(new AppError(500, "error", error.message));
  }
};
//delete Product from the cart
const deleteSingleProductFromCart = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { productId, selectedColour, selectedVariant } = req.body;

    let cart = await Cart.findOne({ orderBy: userId });
    if (!cart) {
      return next(new AppError(404, "error", "Cart not found."));
    }
    const itemIndex = cart.items.findIndex(
      (item) =>
        item.product.equals(productId) &&
        item.selectedColour.equals(selectedColour) &&
        item.selectedVariant === selectedVariant
    );

    if (itemIndex === -1) {
      return next(new AppError(404, "error", "Item not found in cart."));
    }

    cart.items.splice(itemIndex, 1);

    //recalculate
    cart.totalPrice = cart.calculateTotal();

    if (cart.coupon && cart.coupon.code) {
      const discountAmount = (cart.totalPrice * cart.coupon.discount) / 100;
      cart.discountAmount = mongoose.Types.Decimal128.fromString(
        discountAmount.toFixed(2)
      );
      cart.discountedPrice = mongoose.Types.Decimal128.fromString(
        (cart.totalPrice - parseFloat(cart.discountAmount.toString())).toFixed(
          2
        )
      );
    } else {
      cart.discountAmount = mongoose.Types.Decimal128.fromString("0.00");
      //cart.discountedPrice = cart.totalPrice;
      cart.discountedPrice = 0;
    }
    await cart.save();
    return res.status(200).json({
      status: "success",
      message: "Item removed from cart successfully.",
      data: cart,
    });
  } catch (error) {
    return next(new AppError(500, "error", error.message));
  }
};
const getMyCart = async (req,res,next)=>{
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      return next(new AppError(404, 'error', 'User not found.'));
    }

    // let cart = await Cart.findOne({orderBy:userId}).populate('items.product').select('name description').populate('items.colors').select('title');
    let cart = await Cart.findOne({ orderBy: userId })
      .populate({
        path: 'items.product',
        // select: 'name description image', // Select specific fields for product
      })
      .populate({
        path: 'items.selectedColour',
        // model:'Color',
        select: 'hexCode title', // Select specific fields for colors
      })

    if (!cart) {
      return next(new AppError(404, 'error', 'Cart not found.'));
    }
    return res.status(200).json({
      status: "success",
      message: "Cart retrieved successfully.",
      data: cart,
    })
  } catch (error) {
    return next(new AppError(500, 'error', error.message));
  }
}
const deleteItemFromCart = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { productId, selectedColour, selectedVariant } = req.body;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return next(new AppError(404, "error", "User not found."));
    }

    // Get the user's cart
    let cart = await Cart.findOne({ orderBy: userId });
    if (!cart) {
      return next(new AppError(404, "error", "Cart not found."));
    }

    // Find the item index to remove
    const itemIndex = cart.items.findIndex(
      item =>
        item.product.equals(productId) &&
        item.selectedColour.equals(selectedColour) &&
        item.selectedVariant === selectedVariant
    );

    if (itemIndex === -1) {
      return next(new AppError(404, "error", "Item not found in cart."));
    }

    // Remove the item from the cart
    cart.items.splice(itemIndex, 1);

    // Recalculate total price
    cart.totalPrice = cart.calculateTotal();

    // Apply coupon if exists
    if (cart.coupon && cart.coupon.code) {
      const totalPrice = parseFloat(cart.totalPrice.toString());
      const discountAmount = (totalPrice * cart.coupon.discount) / 100;
      cart.discountAmount = mongoose.Types.Decimal128.fromString(discountAmount.toFixed(2));
      cart.discountedPrice = mongoose.Types.Decimal128.fromString(
        (totalPrice - parseFloat(cart.discountAmount.toString())).toFixed(2)
      );
    } else {
      cart.discountAmount = mongoose.Types.Decimal128.fromString("0.00");
      cart.discountedPrice = cart.totalPrice;
    }

    // Save the updated cart
    await cart.save();

    // Populate the cart details before returning it
    const populatedCart = await Cart.findById(cart._id)
      .populate('items.product') // Populate the product details
      .populate('items.selectedColour'); // Populate color details if needed

    return res.status(200).json({
      status: "success",
      message: "Item removed from cart successfully.",
      data: populatedCart,
    });
  } catch (error) {
    return next(new AppError(500, "error", error.message));
  }
};

const emptyCart = async (req, res, next) => {
  try {
    const userId = req.userId;

    // Find the cart
    let cart = await Cart.findOne({ orderBy: userId });
    if (!cart) {
      return next(new AppError(404, 'error', 'Cart not found.'));
    }

    // Check if a coupon is applied
    if (cart.coupon && cart.coupon.code) {
      const coupon = await Coupon.findOne({ code: cart.coupon.code });
      if (coupon) {
        // Decrement the coupon's usage count
        coupon.usageCount -= 1;
        if (coupon.usageCount < 0) {
          coupon.usageCount = 0; // Ensure the usage count doesn't go below 0
        }
        await coupon.save();
      }
    }

    // Clear the items from the cart and reset related fields
    cart.items = [];
    cart.totalPrice = 0;
    cart.discountedPrice = 0;
    cart.discountAmount = 0;
    cart.coupon = null; // Remove the applied coupon

    // Save the updated cart
    await cart.save();

    return res.status(200).json({
      status: "success",
      message: "Cart items removed successfully and related fields updated.",
      data: cart, // Return the updated cart for verification
    });
  } catch (error) {
    return next(new AppError(500, 'error', error.message));
  }
};

const createOrder = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { paymentMethod, shippingMethod, selectedAddress } = req.body;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return next(new AppError(404, "error", "User not found."));
    }

    // Check if the cart exists and is not empty
    let cart = await Cart.findOne({ orderBy: userId })
      .populate({
        path: 'items.product',
      })
      .populate({
        path: 'items.selectedColour',
        select: 'hexCode title',
      });
      
    if (!cart || cart.items.length === 0) {
      return next(new AppError(404, "error", "Your cart is empty."));
    }

    // Validate cart items
    const validatedItems = cart.items.map(item => {
      if (!item.selectedColour || !item.product || !item.quantity || !item.price) {
        throw new AppError(400, "error", "Missing required fields in cart items.");
      }
      return item;
    });

    // Calculate total price and discount
    const totalProductPrice = parseFloat(cart.totalPrice.toString());
    const discountAmount = cart.discountAmount
      ? parseFloat(cart.discountAmount.toString())
      : 0;
    const totalPriceAfterDiscount = totalProductPrice - discountAmount;

    // Add shipping cost
    const shippingCost = calculateShipping(shippingMethod);
    const totalPaid = totalPriceAfterDiscount + shippingCost;

    // Create the Order
    const order = new Order({
      orderBy: userId,
      items: validatedItems,
      totalPrice: mongoose.Types.Decimal128.fromString(totalProductPrice.toFixed(2)),
      discountAmount: mongoose.Types.Decimal128.fromString(discountAmount.toFixed(2)),
      discountedPrice: mongoose.Types.Decimal128.fromString(totalPriceAfterDiscount.toFixed(2)),
      deliveryStatus: 'Processing',
      selectedAddress,
      shippingMethod,
      paymentMethod,
      selectedShipping: shippingCost ? shippingCost : 0,
      totalPaidByUser: totalPaid,
      paymentInfo: null,
      coupon: cart.coupon ? cart.coupon : undefined,
    });

    // Validate the order before saving
    await order.validate();

    // Process payment based on payment method
    let paymentStatus;
    let transactionId;

    switch (paymentMethod) {
      case "COD":
        paymentStatus = "Pending";
        transactionId = "COD-" + new Date().getTime();
        break;
      case "CreditCard":
        paymentStatus = await processCreditCardPayment(totalPaid);
        transactionId = "CC-" + new Date().getTime();
        break;
      case "UPI":
        paymentStatus = await processUPIPayment(totalPaid);
        transactionId = "UPI-" + new Date().getTime();
        break;
      case "PayPal":
        paymentStatus = await processPayPalPayment(totalPaid);
        transactionId = "PP-" + new Date().getTime();
        break;
      default:
        return next(new AppError(400, "error", "Invalid payment method."));
    }

    if (paymentStatus !== "Success" && paymentMethod !== "COD") {
      return next(new AppError(400, "error", "Payment failed."));
    }

    // Save payment info after successful order validation
    const payment = new Payment({
      orderBy: userId,
      paymentMethod,
      amount: mongoose.Types.Decimal128.fromString(totalPaid.toFixed(2)),
      paymentStatus,
      transactionId,
      paymentDetails: {},
    });

    await payment.save();

    // Link payment info to the order
    order.paymentInfo = payment._id;
    await order.save();

    // **Clear the cart after order is placed**
    cart.items = []; // Clear items from the cart
    cart.totalPrice = mongoose.Types.Decimal128.fromString("0.00");
    cart.discountAmount = mongoose.Types.Decimal128.fromString("0.00");
    cart.discountedPrice = mongoose.Types.Decimal128.fromString("0.00");
    cart.coupon = null;
    await cart.save();

    return res.status(201).json({
      status: "success",
      message: "Order created successfully, and cart cleared.",
      data: order,
    });
  } catch (error) {
    return next(new AppError(500, "error", error.message));
  }
};


const processCreditCardPayment = async (amount) => {
  // Integrate with a credit card payment gateway
  // Return "Success" or "Failed" based on the payment result
  return "Success"; // Mock success response
};

const processUPIPayment = async (amount) => {
  // Integrate with UPI payment gateway
  // Return "Success" or "Failed" based on the payment result
  return "Success"; // Mock success response
};

const processPayPalPayment = async (amount) => {
  // Integrate with PayPal API
  // Return "Success" or "Failed" based on the payment result
  return "Success"; // Mock success response
};

const calculateShipping = (shippingMethod) => {
  // Logic to calculate shipping cost based on the method
  switch (shippingMethod) {
    case "Standard":
      return 5.00; // Example shipping cost
    case "Express":
      return 10.00; // Example shipping cost
    default:
      return 0.00; // Free shipping or no shipping
  }
};
// getMyOrder

const getMyOrder = async (req, res, next) => {
  try {
    const userId = req.userId;
    const order = await Order.find({ orderBy: userId }).populate({
      path: "items.product",
      //select: "name description price",
    });

    if (!order) {
      return next(new AppError(404, "error", "No order found."));
    }

    return res.status(200).json({
      status: "success",
      data: order,
    });
  } catch (error) {
    return next(new AppError(500, "error", error.message));
  }
};

//getsingle order

const getSingleOrder = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.findById(orderId).populate({
      path: "items.product",
    });

    if (!order) {
      return next(new AppError(404, "error", "No order found."));
    }

    return res.status(200).json({
      status: "success",
      data: order,
    });
  } catch (error) {
    return next(new AppError(500, "error", error.message));
  }
};

const adminUpdateOrder = async (req, res, next) => {
  try {
    const { orderId, deliveryStatus, paymentStatus, selectedShipping } = req.body;

    // Validate input
    if (!orderId) {
      throw new Error("Order ID is required");
    }

    // Find and update the order
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    // Only update fields that are present in the request body
    if (selectedShipping) {
      order.selectedShipping = selectedShipping;
    }
    if (deliveryStatus) {
      order.deliveryStatus = deliveryStatus;
      if (deliveryStatus === 'Delivered') {
        order.deliveredAt = new Date();
        const returnDeadline = new Date(order.deliveredAt);
        returnDeadline.setDate(returnDeadline.getDate() + 7);
        order.returnDeadline = returnDeadline;
      }
      if (deliveryStatus === 'Canceled' && order.deliveryStatus !== 'Delivered') {
        order.canceled = true;
      }
    }
    if (paymentStatus) {
      if (order.paymentMethod === 'COD') {
        order.paymentStatus = paymentStatus;
        if (paymentStatus === 'Refunded') {
          // Implement refund logic if needed
        }
      } else if (['PayPal', 'Card', 'UPI'].includes(order.paymentMethod) && paymentStatus === 'Paid') {
        order.paymentStatus = paymentStatus;
      } else {
        throw new Error("Payment status can only be updated to 'Paid' for non-COD methods or any status for COD.");
      }
    }

    await order.save();
    res.status(200).json({
      status: "success",
      message: "Order updated successfully.",
      data: order,
    });
  } catch (error) {
    console.error("Error in adminUpdateOrder:", error);
    res.status(500).json({ error: error.message });
  }
};

const userUpdateOrder = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { orderId, action } = req.body; // action can be "cancel" or "return"

    // Find the order by ID
    const order = await Order.findOne({ _id: orderId, orderBy: userId });
    if (!order) {
      return next(new AppError(404, "error", "Order not found."));
    }

    // Handle cancel action
    if (action === "cancel") {
      if (order.deliveryStatus === 'Delivered') {
        return next(new AppError(400, "error", "Cannot cancel a delivered order."));
      }
      if (order.deliveryStatus !== 'Canceled') {
        order.deliveryStatus = 'Canceled';
        order.canceled = true;
        await order.save();
        return res.status(200).json({
          status: "success",
          message: "Order canceled successfully.",
          data: order,
        });
      } else {
        return next(new AppError(400, "error", "Order is already canceled."));
      }
    }

    // Handle return action
    if (action === "return") {
      if (order.deliveryStatus !== 'Delivered') {
        return next(new AppError(400, "error", "Cannot return an undelivered order."));
      }
      const currentDate = new Date();
      if (currentDate > new Date(order.returnDeadline)) {
        return next(new AppError(400, "error", "Return period has expired."));
      }

      if (!order.returnRequested) {
        order.returnRequested = true;
        await order.save();
        return res.status(200).json({
          status: "success",
          message: "Return request submitted successfully.",
          data: order,
        });
      } else {
        return next(new AppError(400, "error", "Return request is already submitted."));
      }
    }

    return next(new AppError(400, "error", "Invalid action."));
  } catch (error) {
    return next(new AppError(500, "error", error.message));
  }
};

const getAdminStats = async (req, res) => {
  try {
    // Get admin details
    const adminId = req.userId;
    const admin = await User.findById(adminId).select('firstName lastName email phoneNo address').populate('address');

    const today = new Date();
    const previousMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const nextMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfCurrentMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    // Product statistics and totals
    const stats = await Order.aggregate([
      { $unwind: "$items" },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      { $unwind: "$productDetails" },
      {
        $project: {
          quantity: { $convert: { input: "$items.quantity", to: "double", onError: 0 } },
          price: { $convert: { input: "$items.price", to: "double", onError: 0 } },
          name: "$productDetails.name"
        }
      },
      {
        $group: {
          _id: "$items.product",
          name: { $first: "$name" },
          totalSold: { $sum: "$quantity" },
          totalRevenue: { $sum: { $multiply: ["$quantity", "$price"] } }
        }
      },
      {
        $project: {
          _id: 0,
          productId: "$_id",
          name: 1,
          totalSold: 1,
          totalRevenue: { $round: ["$totalRevenue", 2] }
        }
      },
      {
        $facet: {
          stats: [{ $sort: { totalRevenue: -1 } }],
          totals: [
            {
              $group: {
                _id: null,
                totalRevenue: { $sum: "$totalRevenue" },
                totalSold: { $sum: "$totalSold" }
              }
            }
          ]
        }
      },
      {
        $project: {
          productStats: { $arrayElemAt: ["$stats", 0] },
          totalRevenue: { $arrayElemAt: ["$totals.totalRevenue", 0] },
          totalSold: { $arrayElemAt: ["$totals.totalSold", 0] }
        }
      }
    ]);

    const { totalRevenue = 0, totalSold = 0, productStats = [] } = stats[0] || {};

    // Previous month revenue
    const previousMonthRevenue = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth, $lt: nextMonth } } },
      { $unwind: "$items" },
      {
        $project: {
          quantity: { $convert: { input: "$items.quantity", to: "double", onError: 0 } },
          price: { $convert: { input: "$items.price", to: "double", onError: 0 } }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: { $multiply: ["$quantity", "$price"] } }
        }
      },
      {
        $project: {
          _id: 0,
          totalRevenue: { $round: ["$totalRevenue", 2] }
        }
      }
    ]);

    const previousMonthTotalRevenue = previousMonthRevenue[0]?.totalRevenue || 0;

    // Current year's monthly sales
    const currentYearMonthlySales = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(today.getFullYear(), 0, 1),
            $lte: new Date(today.getFullYear(), 11, 31)
          }
        }
      },
      { $unwind: "$items" },
      {
        $project: {
          quantity: { $convert: { input: "$items.quantity", to: "double", onError: 0 } },
          price: { $convert: { input: "$items.price", to: "double", onError: 0 } },
          month: { $month: "$createdAt" }
        }
      },
      {
        $group: {
          _id: "$month",
          totalSales: { $sum: { $multiply: ["$quantity", "$price"] } }
        }
      },
      {
        $project: {
          _id: 0,
          month: "$_id",
          totalSales: { $round: ["$totalSales", 2] }
        }
      },
      { $sort: { month: 1 } }
    ]);

    const monthlySalesData = Array.from({ length: 12 }, (_, i) => {
      const monthData = currentYearMonthlySales.find(d => d.month === i + 1);
      return monthData ? monthData.totalSales : 0;
    });

    // Last 10 years annual sales
    const lastTenYearsSales = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(today.getFullYear() - 10, 0, 1),
            $lte: new Date(today.getFullYear(), 11, 31),
          },
        },
      },
      { $unwind: "$items" },
      {
        $project: {
          quantity: { $convert: { input: "$items.quantity", to: "double", onError: 0 } },
          price: { $convert: { input: "$items.price", to: "double", onError: 0 } },
          year: { $year: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$year",
          totalSales: { $sum: { $multiply: ["$quantity", "$price"] } },
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id",
          totalSales: { $round: ["$totalSales", 2] },
        },
      },
      { $sort: { year: 1 } },
    ]);

    // Get current year and calculate the range of the last 10 years
    const currentYear = today.getFullYear();
    const lastTenYears = Array.from({ length: 10 }, (_, i) => currentYear - 9 + i);

    // Create a map of the retrieved sales data for quick lookup
    const salesMap = new Map(lastTenYearsSales.map((data) => [data.year, data.totalSales]));

    // Fill missing years with zero sales
    const annualSalesData = lastTenYears.map((year) => salesMap.get(year) || 0);
    const years = lastTenYears;

    // Current month's weekly sale 
    const currentMonthWeeklySales = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfCurrentMonth,
            $lte: endOfCurrentMonth
          }
        }
      },
      {
        $project: {
          weekOfMonth: {
            $add: [
              { $ceil: { $divide: [{ $dayOfMonth: "$createdAt" }, 7] } },
              -1
            ]
          },
          totalAmount: { $convert: { input: "$totalPrice", to: "double", onError: 0 } }
        }
      },
      {
        $group: {
          _id: "$weekOfMonth",
          totalSales: { $sum: "$totalAmount" }
        }
      },
      {
        $project: {
          _id: 0,
          week: { $add: ["$_id", 1] },
          totalSales: { $round: ["$totalSales", 2] }
        }
      },
      { $sort: { week: 1 } }
    ]);
    
    // Convert to a map for quick lookup
    const weeklySalesMap = new Map(currentMonthWeeklySales.map(entry => [entry.week, entry.totalSales]));
    
    // Fill in missing weeks with zero sales
    const weeks = [1, 2, 3, 4, 5]; // Adjust according to your needs
    const filledWeeklySales = weeks.map(week => ({
      week: week,
      totalSales: weeklySalesMap.get(week) || 0
    }));
    
    res.status(200).json({
      admin,
      totalRevenue,
      totalSold,
      productStats,
      previousMonthTotalRevenue,
      monthlySalesData,
      annualSalesData,
      years,
      weeklySalesData:filledWeeklySales
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return res.status(500).json({ status:'error',message: error.message });
  }
};

// checkToken
const checkTokenExpiration = async (req, res, next) => {
  try {
    // Extract token from the request body (adjust this if token comes from headers or other sources)
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ expired: true, message: 'Token is missing.' });
    }

    // Verify the token; this will automatically check if the token is valid and not expired
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        // Check if the error is due to expiration
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ expired: true, message: 'Token has expired. Please log in again.' });
        }
        // Handle other token verification errors
        return res.status(401).json({ expired: true, message: 'Invalid token.' });
      }

      // Token is valid and not expired; proceed to the next middleware or route handler
      next();
    });
  } catch (error) {
    // Handle unexpected errors
    return res.status(500).json({ message: 'An error occurred while checking the token.', error: error.message });
  }
};

export {
  //User
  registerUser,
  sendOtp,
  verifyOtp,
  protect,
  loginUser,
  sendTokenForForgotPassowrd,
  resetPassowrdforToken,
  updatedUser,
  logoutUser,
  removeItemFromWishlist,
  addToCart,
  updateCartItemQuantity,
  applyCoupon,
  deleteItemFromCart,
  deleteSingleProductFromCart,
  emptyCart,
  getMyCart,
  createOrder,
  getMyOrder,
  getSingleOrder,
  userUpdateOrder,

  //Admin
  loginAdmin,
  blockUser,
  unBlockUser,
  getSingleUser,
  getAllUser,
  isAdmin,
  adminUpdateOrder,
  getAllOrdersForAdmin,
  getAdminStats,
  checkTokenExpiration

  //order
};
