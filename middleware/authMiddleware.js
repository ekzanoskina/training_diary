const authMiddleware = (req, res, next) => {
    // Check if the user object exists in the session
    if (!req.session.user) {
        return res.status(401).send('Not authorized'); // Send 401 Unauthorized response
    }
    next(); // Proceed to the next middleware or route handler
};

module.exports = authMiddleware;