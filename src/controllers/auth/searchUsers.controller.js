import User from '../../model/user.model.js';
import errorHandler from "../../utils/errorHandler.js";

export default async function getUsers(req, res) {
    try {
        const userId = req.user.userId;
        const { name } = req.query;
        // Create a filter object that always excludes the current user
        let filter = { _id: { $ne: userId } };

        // If a name is provided, add the username filter
        if (name) {
            filter.username = new RegExp(name, 'i');
        }

        // Find users with the specified filter
        const users = await User.find(filter).select(['-code', '-__v']).limit(10);
        return res.json({
            success: true,
            message: "User Data Fetched",
            data: users
        });

    } catch (e) {
        return errorHandler({
            e,
            res,
            code: 500,
            title: "User Authorization Error",
            message: "Server Error on User Authorization",
        });
    }
}