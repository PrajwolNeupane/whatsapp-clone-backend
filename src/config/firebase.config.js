import * as dotenv from 'dotenv';
import { initializeApp } from "firebase/app";


dotenv.config()


const config = {
    firebaseConfig: {
        apiKey: `${process.env.FIREBASE_API_KEY}`,
        authDomain: `${process.env.FIREBASE_AUTH_DOMAIN}`,
        databaseURL: `${process.env.FIREBASE_DB_URL}`,
        projectId: `${process.env.FIREBASE_PROJECT_ID}`,
        storageBucket: `${process.env.FIREBASE_STORAGE_BUCKET}`,
        messagingSenderId: `${process.env.FIREBASE_MESSAGING_SENDER_ID}`,
        appId: `${process.env.FIREBASE_APP_ID}`,
    }
}


const app = initializeApp(config)
export default app;