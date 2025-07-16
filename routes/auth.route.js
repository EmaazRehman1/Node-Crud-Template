const express = require('express');
const router = express.Router();
const {SignUp,login}=require('../controllers/auth.controller')

router.post('/register',SignUp)
router.post('/login',login)
// router.post('/refresh',handleRefreshToken)
module.exports = router;