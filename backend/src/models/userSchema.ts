import mongoose, {Schema, model, ObjectId} from 'mongoose';

const userSchema = new Schema({
    name: {
        type: String, 
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        required: true,
        default: 'USER'
    }
}, {
        timestamps: true
    })

const User = model('user', userSchema);
export default User;