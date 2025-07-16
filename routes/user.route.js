const express = require('express');
const router=express.Router();
const {getUserDetails}=require('../controllers/user.controller')
const verifyJWT=require('../middleware/verifyJWT')

router.get('/',verifyJWT,getUserDetails);

module.exports=router;