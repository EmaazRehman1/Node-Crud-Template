const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
    },
    status: {
        type: String,
        enum: {
            values: ['pending', 'in-progress', 'completed'],
            message: 'Status must be either pending, in-progress, or completed'
        },
        default: 'pending',
    },
},
    {
        timestamps: true
    }
)

const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;