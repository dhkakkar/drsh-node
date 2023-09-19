const userDao = require('../../utils/mongodb/dao/user.dao')

module.exports.run = (req, res, next)=>{
    try {
        const model = req.params.model;
        const keyword = req.query.keyword;
        if(model == "USER"){

        }
    } catch (error) {
        next(error)
    }
}