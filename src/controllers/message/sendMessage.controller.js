import Message from '../../model/message.model.js';
import Conversation from '../../model/conversation.model.js';
import errorHandler from '../../utils/errorHandler.js';
import Joi from 'joi';

const schema = Joi.object({
    conversationId: Joi.string().required(),
    message: Joi.string().required(),
    type: Joi.string().required()
});

export default async function sendMessage(req, res) {

    const { error, value } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({ success: false, message: error.details[0].message });
    }

    try {
        const conversationId = value.conversationId;
        var userId = req.user.userId;
        var message = Message({
            message: value.message,
            type: value.type,
            sender_id: userId,
            conversation_id: conversationId
        })
        message = await message.save();
        await Conversation.findOneAndUpdate({ _id: conversationId }, {
            latest_message: message?._id
        })
        return res.json({
            success: true,
            message: 'Message Send',
            data: message
        })

    } catch (e) {
        return errorHandler({
            e,
            res,
            code: 500,
            title: 'Message Error',
            message: 'Server Error on Sending Message',
        });
    }
}
