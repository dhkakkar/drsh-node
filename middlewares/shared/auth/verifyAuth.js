const jwt = require('jsonwebtoken')
const { UnauthorizedError } = require('../../../utils/handler/error')
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

const verifyJWT = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, JWT_SECRET_KEY, (err, payload) => {
            if (err) {
                reject(err);
            } else {
                resolve(payload);
            }
        });
    })

}

module.exports.run = async (req, res, next) => {
    try {
        if (res.locals.skipAuth) {
            next()
        } else {
            const token = req.headers.authorization
            if (!token) {
                const err = new Error("Authorization required")
                next(err)
            } else {
                const decoded = await verifyJWT(token);
                req.user = decoded;
                if(req.user.isActive) {
                    next()
                }else{
                    throw new Error("User not active")
                }
                
            }
        }

    } catch (error) {
        const err = new UnauthorizedError(error.message, null, error.name);
        next(err)
    }
}