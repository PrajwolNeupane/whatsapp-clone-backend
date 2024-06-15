import mongoose from "mongoose";


const MessageModel = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // This assumes you have a User model defined elsewhere
        required: true
    },
    type: {
        type: String,
        required: true
    },
    seen_at: {
        type: String,
    },
    conversation_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation', // This assumes you have a User model defined elsewhere
        required: true
    }
}, {
    timestamps: true
});

const Message = mongoose.model("Message", MessageModel);
export default Message;
