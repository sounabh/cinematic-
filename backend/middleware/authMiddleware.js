import User from "../models/userModel.js";
import jwt from "jsonwebtoken"


const authMiddleware = async (req,res,next) => {



    try {
        
       const token =  req.headers.authorization?.split(' ')[1];
      // console.log("t",token);
       
      // console.log(req.cookies.token);
       
       //console.log(req.headers);
       

      //console.log(req.headers.authorization?.split(' ')[1]);
       //console.log(token);
       
       
       // console.log(req.headers.authorization?.split(' ')[1]);
        
        if (!token) {
            return res.status(401).json({
                message: "Please login first"
            });
        }


        let decoded;
        try {
          decoded = jwt.verify(token, process.env.JWT_SECRET);
        //  console.log("Decoded token:", decoded);
        } catch (jwtError) {
          //console.error("JWT verification failed:", jwtError.message);
          return res.status(401).json({ message: "Invalid token" });
        }
        

       // console.log(decoded);
        

        const user = await User.findOne({ _id: decoded.id });


        if (!user) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        req.user = user;
        next();

      // console.log(token);

        //req.token = token
        //ext()
        
    } catch (error) {
        console.log(error);
        return res.status(500)
        
    }

}

export default authMiddleware


/*
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        
        if (!token) {
            return res.status(401).json({
                message: "Please login first"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await User.findOne({ email: decoded.email }).select('-password');
        
        if (!user) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        req.user = user;
        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid token"
        });
    }
};

export default auth;* */