import User from "../../model/user.model.js";
import errorHandler from "../../utils/errorHandler.js";

export default async function userAuthorization(req, res) {

    try {
        const userId = req.user.userId;
        const user = await User.find({ _id: userId }).select(['-code', '-__v']);
        res.json({
            success: true,
            message: "User Data Fetched",
            data: user
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