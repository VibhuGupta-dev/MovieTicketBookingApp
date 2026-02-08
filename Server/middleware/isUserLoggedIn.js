import jwt from "jsonwebtoken";
import User from "../models/UserSchema.js";

const jwtSecret = process.env.JWT_SECRET;

export async function isuserloggedin(req, res, next) {
  try {
    
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "No token found" });
    }

   
    const decoded = jwt.verify(token, jwtSecret);
    if(!decoded) {
      return res.status(400).json({message : "it is not decoded"})
    }
  
    const userEmail = decoded.email;
    if(!userEmail) {
      return res.status(400).json({message : "username not found"})
    }

    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    if (user.role !== "user") {
      return res.status(403).json({ message: "Access denied: user Only" });
    }

    
    req.userId = user._id;

    next();

  } catch (err) {
    console.error("USER MIDDLEWARE ERROR:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
