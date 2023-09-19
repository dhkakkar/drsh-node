const moment = require('moment');
const appConfig = require('../../config/appConfig.json')
const userDao = require('../../utils/mongodb/dao/user.dao')
module.exports.run = async(req, res,next)=>{
    try {
        let users
        if(req.query.pagination){
            users = await userDao.getUserByKeyValue(req.query.pagination)
        }else{
            users = await userDao.getUserByKeyValue()
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
        res.locals.rootData = users;
        next()
    } catch (error) {
        next(error)
    }
}