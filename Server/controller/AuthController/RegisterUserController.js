import bcrypt, { hash } from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../../models/UserSchema.js"
import nodemailer from 'nodemailer'
import dotenv from "dotenv";
dotenv.config();

const NodeEmail = process.env.EMAIL
const EmailPass = process.env.EMAIL_PASS



const RegisterUserController = async (req, res) => {
  try {
    const { Name, Email, PhoneNumber, Password } = req.body;

    const existingUser = await User.findOne({ Email });
    if (existingUser) {
      return res.status(400).json({ message: "Enter a different Email" });
    }

    const otp = Math.floor(1000 + Math.random() * 9000);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: NodeEmail,
        pass: EmailPass,
      },
    });

    // Send mail
    const info = await transporter.sendMail({
      from: NodeEmail,
      to: Email,
      subject: "OTP Verification",
      html: `<h1>Your OTP is: ${otp}</h1>`,
    });

    console.log("Message sent:", Email);

    return res.status(200).json({
      message: "OTP sent to email",
      otp: otp  
    });



    
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "register user failed" });
  }
};



export default RegisterUserController

