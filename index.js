const express = require('express')
const mongoose = require('mongoose')
const app = express()
require('dotenv').config()
const port = 5000;
const Task = require('./models/task.model')
const taskRoutes = require('./routes/task.route')
const authRoutes=require('./routes/auth.route')
const userRoutes=require('./routes/user.route')
app.use(express.json())
app.get('/', (req, res) => {
  res.send('Hello World')
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})

app.use('/api/task', taskRoutes);
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('DB Connected!'));