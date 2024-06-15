import "dotenv/config";
import app from "../../config/firebase.config.js";
import User from "../../model/user.model.js";
import errorHandler from "../../utils/errorHandler.js";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";

export default async function updateProfile(req, res) {
    const storage = getStorage(app, process.env.FIREBASE_STORAGE_BUCKET);
    let photoURL;

    try {
        const userId = req.user.userId;
        const file = req.file;

        if (!file) {
            // Update the user's profile photo in the database
            const user = await User.findOneAndUpdate(
                { _id: userId },
                { ...req.body },
                { new: true } // Return the updated document
            );
            return res.json({
                success: true,
                message: "User Profile Updated",
                data: user,
            });


        } else {
            const fileRef = ref(storage, "profile/" + userId + '.png');
            const metadata = {
                contentType: file.mimetype,
            };

            // Upload the file to Firebase Storage
            const snapshot = await uploadBytesResumable(fileRef, file.buffer, metadata);

            // Get the download URL for the uploaded file
            photoURL = await getDownloadURL(snapshot.ref);

            // Update the user's profile photo in the database
            const user = await User.findOneAndUpdate(
                { _id: userId },
                { photo: photoURL, ...req.body },
                { new: true } // Return the updated document
            );

            res.json({
                success: true,
                message: "User Profile Updated",
                data: user,
            });
        }


    } catch (e) {
        // Improved error handling
        return errorHandler({
            e,
            res,
            code: 500,
            title: "User Profile Update Error",
            message: e.message || "An error occurred while updating the user profile",
        });
    }
}
