import jwt from "jsonwebtoken";
import User from "../models/UserSchema.js";

const jwtSecret = process.env.JWT_SECRET;

export async function isownerloggedin(req, res, next) {
  try {
    
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "No token found" });
    }

   
    const decoded = jwt.verify(token, jwtSecret);
    console.log("DECODED:", decoded);

  
    const userEmail = decoded.email;

    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    if (user.role !== "owner") {
      return res.status(403).json({ message: "Access denied: Owner only" });
    }

    
    req.userId = user._id;

    next();

  } catch (err) {
    console.error("OWNER MIDDLEWARE ERROR:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
