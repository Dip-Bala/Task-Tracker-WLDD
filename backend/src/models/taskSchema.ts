import mongoose, {Schema, model} from 'mongoose';

const taskSchema = new Schema({
    title: {
        type: String, 
        required: true
    },
    description: {
        type: String,
    },
    status: {
        type: String,
        enum: ['PENDING', 'WORKING ON', 'DONE'],
        default: 'PENDING'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
}, {
        timestamps: true
    })

const Task = model('task', taskSchema);
export default Task;