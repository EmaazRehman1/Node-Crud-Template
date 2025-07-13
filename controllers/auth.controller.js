const bcrypt=require('bcrypt');
const User=require('../models/user.model');
const mongoose=require('mongoose');
const jwt=require('jsonwebtoken');
const {ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET} = process.env;


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
        res.status(201).json({
            message: 'User created successfully',
            data: {
                id: user._id,
                name: user.name,
                email: user.email 
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
        const accessToken=jwt.sign({
            name:user.name,
        },
        ACCESS_TOKEN_SECRET,{
            expiresIn: '30s'
        })
        res.status(200).json({
            message: 'User logged in successfully',
            data: {
                id: user._id,
                name: user.name,
                email: user.email 
            }
        });

    }catch(err){
        return res.status(500).json({message: 'Internal server error'});
    }
}
    

module.exports={SignUp, login};