import User from "../../model/user.model.js";
import errorHandler from "../../utils/errorHandler.js";
import generateTokens from "../../utils/generateToken.js";

export default async function refreshToken(req, res) {

    try {
        const userId = req.user.userId;
        const user = await User.find({ _id: userId }).select(['-code', '-__v']);
        // Generate access and refresh tokens
        const tokens = generateTokens({ userId: userId });

        res.json({
            success: true,
            message: "User Data Fetched",
            data: user,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
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