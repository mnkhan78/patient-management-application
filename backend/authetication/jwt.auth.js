//jwt (jasonweb token) authentication and role based authorization
const jwt = require('jsonwebtoken');

const jwtAuthMiddleware = (req, res, next) => {
    
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token missing' });
    }
    try {
        //verfiy the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //attach the user info to the request object
        req.user = decoded;

        //proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error('JWT verification failed:', error);
        return res.status(403).json({ message: 'Invalid token', error: error.message });
    }
}

//function to generate jwt token
const generateToken = (userData) => {
    //generate a new jwt token using userdata and secret key
    return jwt.sign(userData, process.env.JWT_SECRET);
}

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied' });
        }
        next();
    };
};


module.exports = {jwtAuthMiddleware, generateToken, authorizeRoles};