
const { ValidationError } = require("../../utils/handler/error");
const adminDao = require('../../utils/mongodb/dao/admin.dao')
const appConfig = require('../../config/appConfig.json')
const moment = require('moment');

module.exports.run = async (req, res, next) => {
    try {
        const result = await adminDao.getAllUsers()
        result.forEach(e => {
            delete e.password
            delete e.loginType
            delete e.googleIdToken
            delete e.type
            delete e.__v
            e.createdOn = moment(e.createdOn).format(appConfig.DATETIME_FORMAT_12)
            return e
        });
        res.locals.rootData = result
        next()
    } catch (error) {
        next(error);
    }
};
