import User from "../../models/UserSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookie from "cookie-parser"


const jwtSecret = process.env.JWT_SECRET
export async function  loginUser(req , res) {
    try {
 
        const {email , password} = req.body;
    console.log(password)

        const user = await User.findOne({email : email})
        
        const pass = String(user.password )
     const checkpass =  await bcrypt.compare(password , pass )

     console.log(checkpass , pass , password)
        if(checkpass == false){
            return res.status(400).json({message : "pass do not match"})
        }else {

      
          const token = jwt.sign(
            { id: user._id, email: user.email },
            jwtSecret,
            { expiresIn: "7d" }
          );
      
          res.cookie("token", token, {
            httpOnly: true,
            secure: false 
          });

        }

        return res.status(200).json({message : `login sucessfull email : ${email}  pass :  ${password}`})

    }catch (err){
      
      return res.status(500).json({message : "error in loginuser" , Error });
      

    }
}