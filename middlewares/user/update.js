
const { ValidationError } = require("../../utils/handler/error");
const userDao = require('../../utils/mongodb/dao/user.dao')

module.exports.run = async (req, res, next) => {
    try {
        let users = await userDao.getUserByKeyValue('_id',req.params.userId)
        if(!users.length){
            throw new BadRequestError("No User found with this id")
        }
        const data = req.body;
        await userDao.updateUserByCondition({_id:req.params.userId}, data)
        res.locals.rootData = "Update Successfully Done"
        next()
    } catch (error) {
        next(error);
    }
};
