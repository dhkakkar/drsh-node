const appointmentDao = require('../../utils/mongodb/dao/appointment.dao')
module.exports.run = async(req, res, next)=>{
    try {
        const userId = req.user._id
        let result;
        if(req.user.type == "USER"){
            result = await appointmentDao.getTodayAppointmentByKeyValue('userId', userId)
        }else if(req.user.type == "ADMIN"){
            result = await appointmentDao.getTodayAppointmentByKeyValue('doctorId', userId)
        }else if(req.user.type == "SUPERADMIN"){
            result = await appointmentDao.getAllTodayAppointments()
        }else{
            throw new Error("User Type not accessible")
        }
        res.locals.rootData = result
        next()

    } catch (error) {
        next(error)
    }
}