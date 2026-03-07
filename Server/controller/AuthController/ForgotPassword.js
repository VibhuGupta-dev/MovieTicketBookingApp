import User from "../../models/UserSchema.js";
import { Resend } from "resend";
import bcrypt from "bcrypt";

const resend = new Resend(process.env.RESEND_API_KEY);
const otpStorage = new Map();

export async function forgotpass(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Enter email" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "No user found with this email" });
    }

    const otp = Math.floor(1000 + Math.random() * 9000);

    otpStorage.set(email, {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000
    });

    // ✅ Resend use ho raha hai
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Password Reset OTP",
      html: `<h2>Your OTP is: ${otp}</h2>`
    });

    return res.status(200).json({ message: "OTP sent to email" });

  } catch (err) {
    console.log("FULL ERROR:", err);
    return res.status(500).json({ message: "Error in forgot password", error: err.message });
  }
}

export async function verifyforogtpass(req, res) {
  try {
    const { otp, email, newpass } = req.body;

    const data = otpStorage.get(email);
    if (!data) {
      return res.status(400).json({ message: "OTP expired or not found" });
    }

    if (Date.now() > data.expiresAt) {
      otpStorage.delete(email);
      return res.status(400).json({ message: "OTP expired" });
    }

    if (Number(otp) !== Number(data.otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const hashedpass = await bcrypt.hash(newpass, 10);

    const user = await User.findOneAndUpdate(
      { email },
      { password: hashedpass },
      { new: true }
    );

    otpStorage.delete(email);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "Password updated successfully" });

  } catch (err) {
    console.log("verifyForgotPass error:", err);
    return res.status(500).json({ message: "Error in verify forgot password", error: err.message });
  }
}