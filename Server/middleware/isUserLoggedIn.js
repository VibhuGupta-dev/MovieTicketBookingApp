import jwt from "jsonwebtoken"
import userModel from "../../../Billing System/Backend/models/userModel/userModel.js"

const secret = process.env.JWT_SECRET

export async function isUserloggedin(req , res , next) {
try {

const token = req.cookie.token
 if(!token) {
    return res.status(400).json({message : "no token found"})
 }

 const decoded = jwt.decode("token" , secret)
 console.log(decoded)

 const user = await userModel.findById(decoded.id); 
 
 if(!user){
   return res.status(400).json({message : 'user not found'})
 }

 if(user.role !== "user") {
    return res.status(400).json({message : "it is a user logged in"})
 }

 req.user = user.id
 next()
}catch(err){
    return res.status(500).json({message  : "error in islogged in"})
}
}