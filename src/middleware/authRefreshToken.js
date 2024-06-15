import jwt from "jsonwebtoken";

const authenticateRefreshToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Extract the token from the Authorization header

    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET); // Verify and decode the token
        req.user = decoded; // Attach the decoded payload (usually the user ID) to the request object
        next(); // Call the next middleware or route handler
    } catch (err) {
        return res.status(403).json({ error: "Invalid token.", title: "Forbidden" });
    }
};

export default authenticateRefreshToken;