const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
module.exports.run = (req, res, next) => {
    if (res.locals.skipCreateAuthToken === true) {
        next();
        return;
    }
    if (res.user) {
        if (res.locals.rootData) {
            const token = jwt.sign(res.user, JWT_SECRET_KEY);
            res.locals.rootData.authToken = token
        }
        next()
    } else {
        throw new Error("userdata need to be set in res")
    }

}