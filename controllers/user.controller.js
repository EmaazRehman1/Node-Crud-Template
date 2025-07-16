const mongoose = require('mongoose');
const express = require('express');
const User = require('../models/user.model');

const getUserDetails=async(req,res)=>{
    const id=req.user?.id
    console.log(req.user);
    if(!id){
        return res.status(400).json({message: 'User ID is required'});
    }
    try{
        const data= await User.findById(id)
        if(!data){
            return res.status(404).json({message: 'User not found'});
        }
        res.status(200).json({
            message: 'User details fetched successfully',
            data: data
        });

    }catch(err){
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
    }
}

module.exports={getUserDetails}