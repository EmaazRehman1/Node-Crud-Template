const express = require('express');
const mongoose = require('mongoose');
const Task=require('../models/task.model')


const getTasks=async(req,res)=>{
try {
    const {sort}=req.query
    if(sort && !['asc','desc'].includes(sort)){
        return res.status(400).json({ message: 'Sort must be either asc or desc' });
    }
    const sortOrder = sort === 'asc' ? 1 : -1;
    let tasks;
    if(sort){
         tasks = await Task.find().sort({createdAt: sortOrder});
    }
    else{
         tasks = await Task.find().sort({createdAt: -1});
    }
    res.status(200).json({
        message: 'Tasks fetched successfully',
        data: tasks
    });

  } catch (err) {
    res.status(500).json({ message: 'Internal server error' })
  }
}

const getTaskById=async(req,res)=>{
     try {
        const { id } = req.params
        const task = await Task.findById(id);
        res.status(200).json({
          message: 'Task fetched successfully',
          data: task
        })
    
      } catch (err) {
        res.status(500).json({ message: 'Internal server error' })
      }
}


const createTask=async(req,res)=>{
     try {
    if (!req.body.title) {
      return res.status(400).json({ error: "Title is required" });
    }
    const task = await Task.create(req.body);
    res.status(200).json({
      message: 'Task created successfully',
      data: task
    })


  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
}


const updateTask=async(req,res)=>{
     try {
        const { id } = req.params
        const { status } = req.body
        console.log("status", status)
        console.log(req.body)
        if(status && !['pending', 'in-progress', 'completed'].includes(status)) {
          return res.status(400).json({ message: 'Status must be either pending, in-progress, or completed' });
        }
        if (!req.body?.title) {
          return res.status(400).json({ message: "Title is required" });
        }
        if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).json({ message: "Invalid task ID" });
        }
        const task = await Task.findByIdAndUpdate(id, req.body, {
          new: true,
        });
         if (!task) {
          return res.status(404).json({ message: 'Task not found' })
        }
        res.status(200).json({
          message: 'Task updated successfully',
          data: task
        })
    
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' })
      }
}

const deleteTask=async(req,res)=>{
 try{
    const {id}=req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(400).json({ message: "Invalid task ID" });
    }
    const task=await Task.findByIdAndDelete(id);
    if(!task){
      return res.status(404).json({ message: 'Task not found' })
    }
    res.status(200).json({
      message: 'Task deleted successfully',
      data: task
    })

  }catch(err){
    console.error(err);
    res.status(500).json({ message: 'Internal server error' })
  }
}

module.exports = {
getTasks,
getTaskById,
createTask,
updateTask,
deleteTask
}