const express = require('express')
const mongoose = require('mongoose')
const app = express()
const port = 5000;
const Task = require('./models/task.model')
const taskRoutes = require('./routes/task.route')
app.use(express.json())
app.get('/', (req, res) => {
  res.send('Hello World')
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})

app.use('/api/task', taskRoutes);

mongoose.connect('mongodb+srv://EmaazRehman:Emaaz!123@cluster0.aakvplt.mongodb.net/TaskApp?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('DB Connected!'));