import bcrypt from "bcrypt";
import User from "../../model/user.model.js";
import "dotenv/config";
import errorHandler from "../../utils/errorHandler.js";
import generateAvatarUrl from "../../utils/generateAvatar.js";
import generateTokens from "../../utils/generateToken.js";
import Joi from "joi";

// Joi validation schema for User
const userValidationSchema = Joi.object({
    username: Joi.string().required().messages({
        "string.empty": "Username is required.",
        "any.required": "Username is required."
    }),
    email: Joi.string().email().required().messages({
        "string.email": "Please enter a valid email address.",
        "string.empty": "Email is required.",
        "any.required": "Email is required."
    }),
    password: Joi.string().required().messages({
        "string.empty": "Password is required.",
        "any.required": "Password is required."
    })
});

export default async function registerUser(req, res) {
    try {
        // Validating Request Body
        const { error, value } = userValidationSchema.validate(req.body);

        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        // Checking if the user exists or not
        const existingUser = await User.findOne({
            email: value.email,
        });
        if (existingUser) {
            return errorHandler({
                res,
                code: 409,
                title: "Register User",
                message: "User with email already exists",
            });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(value.password, salt);

        // Generate avatar URL
        const avatarUrl = generateAvatarUrl(value.username);

        // Create a new user
        const user = new User({
            username: value.username,
            email: value.email,
            password: hashedPassword,
            photo: avatarUrl,
        });

        // Save the user and get the created user document
        const createdUser = await user.save();

        // Generate access and refresh tokens
        const tokens = generateTokens({ userId: createdUser._id });

        return res.json({
            success: true,
            message: "User Registered",
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        });
    } catch (e) {
        return errorHandler({
            e,
            res,
            code: 500,
            title: "Register User",
            message: "Server Error on User Registration",
        });
    }
}
