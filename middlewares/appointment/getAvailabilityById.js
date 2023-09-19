const { BadRequestError } = require('../../utils/handler/error')
const availabilityDao = require('../../utils/mongodb/dao/availability.dao')
module.exports.run = async(req, res, next)=>{
    try {
        const id = req.params.id
        const result =await availabilityDao.getAvailabilityById(id)
        if(result.length > 0){
            res.locals.rootData = result[0]
        }else{
            throw new BadRequestError("schedule not found")
        }
        
        next()
    } catch (error) {
        next(error)
    }
}