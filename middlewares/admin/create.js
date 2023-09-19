
const { ValidationError } = require("../../utils/handler/error");
const adminDao = require('../../utils/mongodb/dao/admin.dao')

module.exports.run = async (req, res, next) => {
    try {
        const data = req.body;
        const _result = await adminDao.saveUser(data)
        const result = JSON.parse(JSON.stringify(_result))
        delete result.password
        res.locals.rootData = result
        next()
    } catch (error) {
        next(error);
    }
};
