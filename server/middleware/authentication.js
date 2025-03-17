import jwt from 'jsonwebtoken';

export const authentication = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized - No token provided'
        });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized - Invalid token'
            });
        }
        req.user = decoded; // Attach user info to request
        next();
    });
};
