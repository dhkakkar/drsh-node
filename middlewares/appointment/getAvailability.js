const availabilityDao = require('../../utils/mongodb/dao/availability.dao')
module.exports.run = async(req, res, next)=>{
    try {
        
        const userId = req.user._id
        let doctorId = req.query.doctorId
        let result;
        if(req.user.type == "USER"){
            result = await availabilityDao.getAvailabilityByDoctorId(doctorId)
        }else if(req.user.type == "ADMIN"){
            result = await availabilityDao.getAvailabilityByDoctorId(userId)
        }else if(req.user.type == "SUPERADMIN"){
            result = await availabilityDao.getAllAvailability()
        }else{
            throw new Error("User Type not accessible")
        }
        res.locals.rootData = result
        next()
    } catch (error) {
        next(error)
    }
}