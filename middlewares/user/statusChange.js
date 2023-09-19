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
        let saveData;
        if(req.params.status === 'false'){
            saveData = {
                isActive:false
            }
        }else{
            saveData = {
                isActive:true
            }
        }
        
        userDao.updateUserByCondition({_id:req.params.userId}, saveData)
        users = await userDao.getUserByKeyValue('_id',req.params.userId)
        res.locals.rootData = users[0];
        next()
    } catch (error) {
        next(error)
    }
}