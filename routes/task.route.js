const express = require('express');
const { getTasks,getTaskById,createTask,updateTask,deleteTask } = require('../controllers/task.controller');
const router = express.Router();
const verifyJWT=require('../middleware/verifyJWT')

router.get('/',verifyJWT,getTasks)
router.get('/:id',verifyJWT,getTaskById)
router.post('/',verifyJWT,createTask)
router.put('/:id',verifyJWT,updateTask)
router.delete('/:id',verifyJWT,deleteTask)


module.exports = router;