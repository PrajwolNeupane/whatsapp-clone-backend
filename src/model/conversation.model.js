import mongoose from "mongoose";


const ConversationModel = new mongoose.Schema({
    latest_message: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message', // This assumes you have a Message model defined elsewhere
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // This assumes you have a User model defined elsewhere
        required: true
    }]
}, {
    timestamps: true
});

const Conversation = mongoose.model("Conversation", ConversationModel);
export default Conversation;
