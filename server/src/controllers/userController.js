import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/userModal.js";
import { registerSchema, loginSchema } from "../validators/authValidator.js";

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const { error } = registerSchema.validate({
      username,
      email,
      password
    });

    if (error) {
      return res.status(400).json({
        message: error.details[0].message
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword
    });

    user.password = undefined;

    res.status(201).json({
      message: "User created successfully",
      user
    });

  } catch (error) {
    res.status(500).json({
      message: "Internal server error"
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { error } = loginSchema.validate({
      email,
      password
    });

    if (error) {
      return res.status(400).json({
        message: error.details[0].message
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h"
      }
    );

    user.password = undefined;

    res.status(200).json({
      message: "Login successful",
      token,
      user
    });

  } catch (error) {
    res.status(500).json({
      message: "Internal server error"
    });
  }
};

export { registerUser, loginUser };
