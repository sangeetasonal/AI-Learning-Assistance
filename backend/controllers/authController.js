import jwt from "jsonwebtoken";
import User from "../models/User.js";

//Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

//Register a new user
//@route POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ email }] });
    if (userExists) {
      return res
        .status(400)
        .json({
          success: false,
          error:
            userExists.email === email
              ? "Email already registered"
              : "Username already taken",
          StatusCode: 400,
        });
    }

    // Create new user
    const user = await User.create({
      username,
      email,
      password,
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      data: {
        user : {
        _id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
      },
        token,
    },
    message: 'User registered successfully',
    }) ;


  } catch (error) {
    next(error);
  }
};

//login user
//@route POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email and password',
        StatusCode: 400
      });
    }

    //check for user (include password for comparison )
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
        StatusCode: 401
      });
    }

    //check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
        StatusCode: 401
      });
    }

    //generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
      },
      token,
      message: 'User logged in successfully'
    });
  } catch (error) {
    next(error);
  }
};

//Get user profile
//@route GET /api/auth/profile
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
        success: true,
        data: {
            id: user._id,
            username: user.username,
            email: user.email,
            profileImage: user.profileImage,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        },

    }); 
        
  } catch (error) {
    next(error);
  }
};
//Update user profile
//@route PUT /api/auth/profile
export const updateProfile = async (req, res, next) => {
  try {
    const { username, email, profileImage } = req.body;
    const user = await User.findById(req.user._id);

    if (username) user.username = username;
    if (email) user.email = email;
    if (profileImage) user.profileImage = profileImage;

    await user.save();

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
      },
      message: 'Profile updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

//Change user password
//@route POST /api/auth/change-password
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Please provide current and new password',
        StatusCode: 400
      });
    }

    const user = await User.findById(req.user._id).select('+password');

    //check if current password matches
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Current password is incorrect',
        StatusCode: 401
      });
    }

    //update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    next(error);
  }
};
