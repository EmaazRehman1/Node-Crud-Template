const bcrypt=require('bcrypt');
const User=require('../models/user.model');
const mongoose=require('mongoose');
const jwt=require('jsonwebtoken');
// const {ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET} = process.env;
require('dotenv').config();


const SignUp=async (req,res)=>{
    const {name,password,email}=req.body
    if(!name || !password || !email){
        return res.status(400).json({message: 'All fields are required'});
    }
    let user=await User.findOne({email});
    if(user){
        return res.status(400).json({message: 'User already exists'});
    }
    if(password.length<4){
        return res.status(400).json({message: 'Password must be at least 6 characters long'});
    }

    try{
        const hashedPassword=await bcrypt.hash(password,10);
        user=await User.create({
            name,
            email,
            password:hashedPassword
        })
        const accessToken=jwt.sign({id:user._id,},process.env.ACCESS_TOKEN_SECRET,{ expiresIn: '1h'})
        res.status(201).json({
            message: 'User created successfully',
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                accessToken
            }
        });

    }catch(err){
        return res.status(500).json({message: 'Internal server error'});
    }

}

const login=async(req,res)=>{
    const {email,password}=req.body;
    if(!email || !password){
        return res.status(400).json({message: 'All fields are required'});
    }
    try{
        let user= await User.findOne({email})
        if(!user){
            return res.status(400).json({message: 'User does not exist'});
        }
        const validate=await bcrypt.compare(password,user.password)
        if(!validate){
            return res.status(400).json({message: 'Invalid credentials'});
        }

        const accessToken=jwt.sign({ id:user._id, }, process.env.ACCESS_TOKEN_SECRET,{ expiresIn: '1h'})


        // const refreshToken=jwt.sign({
        //     name:user.name,
        // },
        // REFRESH_TOKEN_SECRET,{
        //     expiresIn: '1d'
        // })

        // user.refreshToken=refreshToken;
        // await user.save();

        // res.cookie('jwt',refreshToken,{
        //     httpOnly: true,
        //     maxAge: 24 * 60 * 60 * 1000 // 1 day
        // })
        res.status(200).json({
            message: 'User logged in successfully',
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                accessToken,
            }
        });

    }catch(err){
        return res.status(500).json({message: 'Internal server error'});
    }
}

// const handleRefreshToken=(req,res)=>{
//     const cookies=req.cookies;
//     if(!cookies?.jwt){
//         return res.status(401).json({message: 'No refresh token found'});
//     }
//     const refreshToken=cookies.jwt;
//     const user=User.findOne({refreshToken});
//     if(!user){
//         return res.status(403).json({message: 'Invalid refresh token'});
//     }
//     jwt.verify(
//         refreshToken,
//         REFRESH_TOKEN_SECRET,
//         (err,decoded)=>{
//             if(err || user.name !== decoded.name){
//                 return res.status(403).json({message: 'Invalid refresh token'});
//             }
//             const accessToken=jwt.sign(
//                 {name: decoded.name},
//                 ACCESS_TOKEN_SECRET,
//                 {expiresIn: '30s'}
//             );
//             res.status(200).json({accessToken});
//         }
//     )
// }
    

module.exports={SignUp, login};