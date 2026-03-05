import User from "../../models/UserSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET;

export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    const pass = user.password;
    if (!pass) {
      return res.status(400).json({ message: "pass not come from user" });
    }

    const checkpass = await bcrypt.compare(password, pass);
    if (!checkpass) {
      return res.status(400).json({ message: "pass do not match" });
    }

    // ✅ token ab bahar declare hai — response mein accessible hoga
    const token = jwt.sign(
      { id: user._id, email: user.email , role: user.role},
      jwtSecret,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
    });

    return res.status(200).json({
      message: `login sucessfull email : ${email}`,
      token: token, 
      role : user.role
    });

  } catch (err) {
    return res.status(500).json({ message: "error in loginuser", error: err.message });
  }
}