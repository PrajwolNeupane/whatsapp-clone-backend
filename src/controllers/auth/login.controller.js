import bcrypt from "bcrypt";
import User from "../../model/user.model.js";
import "dotenv/config";
import errorHandler from "../../utils/errorHandler.js";
import generateTokens from "../../utils/generateToken.js";
import Joi from "joi";

// Joi validation schema for login
const loginValidationSchema = Joi.object({
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



export default async function login(req, res) {
    try {
        // Validating Request Body
        const { error, value } = loginValidationSchema.validate(req.body);

        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { email, password } = value;

        // Checking if the user exists or not
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return errorHandler({
                res,
                code: 404,
                title: "Login User",
                message: "User with this email does not exist",
            });
        }

        if (existingUser.password) {
            // Verify the provided password with the stored hashed password
            const validPassword = await bcrypt.compare(password, existingUser.password);
            if (!validPassword) {
                return errorHandler({
                    res,
                    code: 401,
                    title: "Login User",
                    message: "Invalid password",
                });
            }
        } else {
            return errorHandler({
                res,
                code: 401,
                title: "Login User",
                message: "Invalid Login Method",
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
    } catch (e) {
        return errorHandler({
            e,
            res,
            code: 500,
            title: "Login User",
            message: "Server Error on User Login",
        });
    }
}
