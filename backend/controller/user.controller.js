import User from "../models/user.models.js";
import jwt from "jsonwebtoken";


export const registerUser = async (req, res) => {
  try {
    const { fullName, mobile, email, password } = req.body;

    // 🔹 Basic validation
    const errors = {};

    if (!fullName) errors.fullName = "Full name is required";
    if (!mobile) errors.mobile = "Mobile number is required";
    if (!email) errors.email = "Email address is required";
    if (!password) errors.password = "Password is required";

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        errors,
      });
    }

    // 🔹 Check existing email
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(409).json({
        success: false,
        errors: {
          email: "Email already registered",
        },
      });
    }

    // 🔹 Check existing mobile
    const mobileExists = await User.findOne({ mobile });
    if (mobileExists) {
      return res.status(409).json({
        success: false,
        errors: {
          mobile: "Mobile number already registered",
        },
      });
    }

    // 🔹 Create user (password auto-hashed via schema.pre)
    await User.create({
      fullName,
      mobile,
      email,
      password,
      role: "USER", 
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful. Await admin verification.",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Account not verified by admin",
      });
    }

    // 🔐 Generate JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 🍪 Store token in cookie
    res.cookie("token", token, {
  httpOnly: true,
  secure: true,        // 🔥 Render HTTPS ke liye MUST
  sameSite: "none",    // 🔥 Cross-domain ke liye MUST
  maxAge: 24 * 60 * 60 * 1000,
});


    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};




