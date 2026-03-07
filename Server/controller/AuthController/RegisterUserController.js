import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../models/UserSchema.js";
import dotenv from "dotenv";
dotenv.config();

const jwtSecret = process.env.JWT_SECRET;
const otpStorage = new Map();

export async function registerUser(req, res) {
  try {
    const { name, email, phoneNumber, password, role } = req.body;

    if (!name || !email || !phoneNumber || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const otp = Math.floor(1000 + Math.random() * 9000);

    otpStorage.set(email, { role, name, email, phoneNumber, password, otp });

    // ✅ OTP response mein bhej rahe hain temporarily
    return res.status(200).json({ 
      message: "OTP sent to email",
      otp  // baad mein domain leke yeh hata dena
    });

  } catch (err) {
    console.log("registerUser error:", err);
    return res.status(500).json({ message: "Registration failed", error: err.message });
  }
}

export async function verifyOtp(req, res) {
  try {
    const { email, otp } = req.body;

    const data = otpStorage.get(email);
    if (!data) {
      return res.status(400).json({ message: "OTP expired or not found" });
    }

    if (Number(otp) !== Number(data.otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await User.create({
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,
      password: hashedPassword,
      role: data.role
    });

    otpStorage.delete(email);

    const token = jwt.sign(
      { id: user._id, email: user.email },
      jwtSecret,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(201).json({ message: "User registered successfully", user });

  } catch (err) {
    console.log("verifyOtp error:", err);
    return res.status(500).json({ message: "OTP verification failed", error: err.message });
  }
}