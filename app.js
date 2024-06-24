import express from 'express';
import cors from 'cors';
import dbConfig from './src/config/db.config.js';
import auth from './src/routes/auth.route.js';
import conversation from './src/routes/conversation.route.js';
import message from './src/routes/message.route.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import Message from './src/model/message.model.js';
import Conversation from './src/model/conversation.model.js';

const port = 5000;
const app = express();
app.use(
    cors({
        origin: [
            process.env.CLIENT_URL,
            process.env.LIVE_CLIENT_URL,
        ],
        credentials: true,
    })
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Working Fine"
    });
});

app.use("/auth", auth);
app.use("/conversation", conversation);
app.use("/message", message);

// Create HTTP server
const server = createServer(app);

// Create Socket.io server
const io = new Server(server, {
    cors: {
        origin: [
            process.env.CLIENT_URL,
            process.env.LIVE_CLIENT_URL,
        ],
        methods: ["GET", "POST"],
        credentials: true
    }
});

let activeUsers = [];

io.on('connection', (socket) => {

    socket.on("add-user", (newUser) => {
        if (!activeUsers.some((user) => user.user?._id === newUser?._id)) {
            activeUsers.push({ user: newUser, socketId: socket.id });
        }

        io.emit("get-user", activeUsers.filter((value) => {
            if (Object.keys(value.user).length !== 0) {
                return value;
            }
        }));
    })


    socket.on("disconnect", () => {
        // remove user from active users
        activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
        // send all active users to all users
        io.emit("get-user", activeUsers);
    });

    socket.on("send-message", async (data) => {
        const { receiverId } = data;
        const receiverUser = activeUsers.find((user) => user.user?._id === receiverId);
        const senderUser = activeUsers.find((user) => user.user?._id === data.user_id);
        var message = Message({
            message: data.message,
            sender_id: data.user_id,
            type: "text",
            conversation_id: data.conversation_id
        })
        message = await message.save();
        // Populate the sender_id field
        message = await message.populate({
            path: 'sender_id',
            select: 'username email photo' // Fields to select from the User model
        });
        await Conversation.findOneAndUpdate({ _id: data.conversation_id }, {
            latest_message: message?._id
        })
        if (senderUser) {
            io.to(senderUser?.socketId).emit("receive", message);
        }
        if (receiverUser) {
            io.to(receiverUser?.socketId).emit("receive", message);
        }
    });

    socket.on("on-typing", (data) => {
        //Here Sender is the person who is typing
        const { receiverId, senderId } = data;
        const receiverUser = activeUsers.find((user) => user.user?._id === receiverId)
        if (receiverUser) {
            io.to(receiverUser?.socketId).emit("on-typing", { isTyping: true, typierId: senderId });
        }
    })


})

server.listen(port, async () => {
    console.log("---------------------------");
    console.log(`Server is listening at ${port}`);
    await dbConfig;
});

export default server;
