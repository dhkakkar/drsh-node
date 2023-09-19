const moment = require('moment');
const appConfig = require('../../config/appConfig.json')
const userDao = require('../../utils/mongodb/dao/user.dao');
const { BadRequestError } = require('../../utils/handler/error');
module.exports.run = async(req, res,next)=>{
    try {
        let users = await userDao.getUserByKeyValue('_id',req.params.userId)
        if(!users.length){
            throw new BadRequestError("No User found with this id")
        }
        users.forEach(e => {
            delete e.password
            delete e.loginType
            delete e.googleIdToken
            delete e.type
            delete e.__v
            e.createdOn = moment(e.createdOn).format(appConfig.DATETIME_FORMAT_12)
            return e
        });
        res.locals.rootData = users[0];
        next()
    } catch (error) {
        next(error)
    }
}