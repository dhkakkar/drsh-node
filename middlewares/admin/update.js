
const { ValidationError } = require("../../utils/handler/error");
const adminDao = require('../../utils/mongodb/dao/admin.dao')

module.exports.run = async (req, res, next) => {
    try {
        let users = await adminDao.getAllUserByKeyValue('_id',req.params.adminId)
        if(!users.length){
            throw new BadRequestError("No Admin found with this id")
        }
        const data = req.body;
        await adminDao.updateUserByCondition({_id:req.params.adminId}, data)
        res.locals.rootData = "Update Successfully Done"
        next()
    } catch (error) {
        next(error);
    }
};
