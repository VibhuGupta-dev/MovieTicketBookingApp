import jwt from "jsonwebtoken";
import userModel from "../../../Billing System/Backend/models/userModel/userModel.js";

const secret = process.env.JWT_SECRET;

export async function isownerloggedin(req, res, next) {
  try {
    const token = req.cookies.token;   

    if (!token) {
      return res.status(401).json({ message: "No token found" });
    }

    const decoded = jwt.verify(token, secret); 

    const user = await userModel.findById(decoded.id); 

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "owner") {
      return res.status(403).json({ message: "Access denied: Owner only" });
    }

    req.user = user.id;
    next();

  } catch (err) {
    return res.status(500).json({ message: "Error in isownerloggedin" });
  }
}
