const userDao = require('../../../utils/mongodb/dao/user.dao')
const adminDao = require('../../../utils/mongodb/dao/admin.dao');
const { UnauthorizedError, MongoError } = require('../../../utils/handler/error');
const { compareText } = require('../../../utils/services/bcryptText');
module.exports.run = async (req, res, next) => {
    try {
        const user = req.user;
        let result = []
        if (user.type == "USER") {
            result = await userDao.getUserByKeyValue("_id", user._id)
        } else if (user.type == "ADMIN") {
            result = await adminDao.getUserByKeyValue("_id", user._id)
        } else {
            throw new Error("Access denied..")
        }
        if (result.length == 0) {
            throw new UnauthorizedError('User does not exist');
        }
        const dbuser = { ...result[0] };
        const isCompared = await compareText(req.body.oldPassword,dbuser.password);
        if (isCompared) {
            let update = false
            let u
            if (user.type == "USER") {
                update = await userDao.updateUserById(user._id, {password:req.body.newPassword})
            } else if (user.type == "ADMIN") {
                update = await adminDao.updateUserById(user._id, {password:req.body.newPassword})
            } 
            if(!update){
                throw new MongoError(`${user.type.toLowerCase()} not updated`)
            }
            res.locals.rootData = dbuser;
            delete dbuser.password;
            delete dbuser.__v;
            delete res.locals.rootData.password;
            delete res.locals.rootData.__v;
            res.user = dbuser;
            next();
          } else {
            throw new UnauthorizedError('Wrong Password');
          }
    } catch (error) {
        next(error)
    }
}