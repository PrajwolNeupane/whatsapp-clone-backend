import generateTokens from "../../utils/generateToken.js";
import Joi from "joi";
import bcrypt from "bcrypt";
import User from "../../model/user.model.js";
import "dotenv/config";
import errorHandler from "../../utils/errorHandler.js";

// Joi validation schema for login
const googleAuthValidation = Joi.object({
    username: Joi.string().required().messages({
        "string.empty": "Username is required.",
        "any.required": "Username is required."
    }),
    email: Joi.string().email().required().messages({
        "string.email": "Please enter a valid email address.",
        "string.empty": "Email is required.",
        "any.required": "Email is required."
    }),
    googleUID: Joi.string().required().messages({
        "string.empty": "Google UID is required.",
        "any.required": "Google UID is required."
    }),
    photo: Joi.string().required().messages({
        "string.empty": "Photo is required.",
        "any.required": "Photo is required."
    })
});

export default async function googleAuth(req, res) {
    try {
        // Validating Request Body
        const { error, value } = googleAuthValidation.validate(req.body);

        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        // Checking if the user exists or not
        const existingUser = await User.findOne({
            email: value.email
        });
        if (existingUser) {
            // Verify the provided google UID with the stored hashed password
            const validGoogleUID = bcrypt.compare(value.googleUID, existingUser.googleUID);
            if (!validGoogleUID) {
                return errorHandler({
                    res,
                    code: 401,
                    title: "Login User",
                    message: "Invalid Account",
                });
            }
            // Generate access and refresh tokens
            const tokens = generateTokens({ userId: existingUser._id });
            return res.json({
                success: true,
                message: "User Logged In",
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
            });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedGoogleUID = await bcrypt.hash(value.googleUID, salt);


        // Create a new user
        const user = new User({
            username: value.username,
            email: value.email,
            photo: value.photo,
            googleUID: hashedGoogleUID
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
