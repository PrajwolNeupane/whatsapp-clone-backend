import Conversation from '../../model/conversation.model.js';
import errorHandler from '../../utils/errorHandler.js';
import Joi from 'joi';

const schema = Joi.object({
    user_id: Joi.string().required()
});

export default async function createConversation(req, res) {
    const { error, value } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({ success: false, message: error.details[0].message });
    }

    try {
        const userId = req.user.userId;
        const otherUserId = value.user_id;

        // Check if a conversation already exists between the two users
        let existingConversation = await Conversation.findOne({
            users: { $all: [userId, otherUserId] }
        });

        if (existingConversation) {
            return res.json({
                success: false,
                message: "Conversation already exists",
                data: existingConversation
            });
        }

        // Create a new conversation if none exists
        let newConversation = new Conversation({
            users: [userId, otherUserId],
        });

        newConversation = await newConversation.save();

        return res.json({
            success: true,
            message: "Conversation created successfully",
            data: newConversation
        });
    } catch (e) {
        return errorHandler({
            e,
            res,
            code: 500,
            title: "Conversation Error",
            message: "Server Error on Create Conversation",
        });
    }
}
