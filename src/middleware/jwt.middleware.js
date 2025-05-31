import jwt from 'jsonwebtoken';
// import dotenv from 'dotenv';


// dotenv.config();

const jwtAuth = (req, res, next) => {
    // 1. Read the token.
    const token = req.headers['authorization'];

    // 2. If no token, return the error.
    if (!token) {
        return res.status(401).send('Unauthorized');
    }

    // 3. Check if token is valid.
    try {
        const payload = jwt.verify(
            token,
            process.env.JWT_SECRET // Use the secret from .env
        );
        req.user = { userId: payload.userId };
        console.log(payload);
    } catch (err) {
        // 4. Return error.
        console.log(err);
        return res.status(401).send('Unauthorized');
    }

    // 5. Call next middleware.
    next();
};

export default jwtAuth;
