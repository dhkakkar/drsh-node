
const { ValidationError } = require("../../utils/handler/error");
const adminDao = require('../../utils/mongodb/dao/admin.dao')
const moment = require('moment')
const appConfig = require('../../config/appConfig.json')
module.exports.run = async (req, res, next) => {
    try {
        const result = await adminDao.getUserByKeyValue('_id', req.params.userId)
        result.forEach(e => {
            delete e.password
            delete e.loginType
            delete e.googleIdToken
            delete e.type
            delete e.__v
            e.createdOn = moment(e.createdOn).format(appConfig.DATETIME_FORMAT_12)
            return e
        });
        res.locals.rootData = result[0]
        next()
    } catch (error) {
        next(error);
    }
};
