const moment = require('moment');
const adminDao = require('../../utils/mongodb/dao/admin.dao')
const { BadRequestError } = require('../../utils/handler/error');
module.exports.run = async(req, res,next)=>{
    try {
        let users = await adminDao.getAllUserByKeyValue('_id',req.params.adminId)
        if(!users.length){
            throw new BadRequestError("No Admin found with this id")
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
        
        adminDao.updateUserByCondition({_id:req.params.adminId}, saveData)
        users = await adminDao.getAllUserByKeyValue('_id',req.params.adminId)
        res.locals.rootData = users[0];
        next()
    } catch (error) {
        next(error)
    }
}