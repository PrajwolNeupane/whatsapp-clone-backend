import Conversation from '../../model/conversation.model.js';
import errorHandler from '../../utils/errorHandler.js';

export default async function getAllConversation(req, res) {
    try {
        const userId = req.user.userId;

        // Fetch conversations where the user is a participant
        const conversations = await Conversation.find({
            users: { $in: [userId] }
        }).populate({
            path: 'users',
            select: '-password -__v -googleUID', // Exclude sensitive fields
        }).populate({
            path: 'latest_message',
            populate: {
                path: 'sender_id', // Assuming 'sender' is a field in the Message model
                model: 'User',
                select: 'username email photo',
                options: { strictPopulate: false }// Select only specific fields from User
            }
        }).sort({ updatedAt: -1 });

        // Filter out the current user from the users array in each conversation
        const filteredConversations = conversations.map(conversation => {
            const usersExcludingCurrentUser = conversation.users.filter(user => user._id.toString() !== userId);
            return {
                ...conversation._doc,
                users: usersExcludingCurrentUser
            };
        });

        return res.json({
            success: true,
            message: 'Conversation Data Fetched',
            data: filteredConversations
        });
    } catch (e) {
        return errorHandler({
            e,
            res,
            code: 500,
            title: 'Conversation Error',
            message: 'Server Error on Get Conversation Authorization',
        });
    }
}
