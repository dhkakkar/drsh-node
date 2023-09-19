const appointmentDao = require('../../utils/mongodb/dao/appointment.dao')
module.exports.run = async(req, res, next)=>{
    try {
        const userId = req.user._id
        let result;
        if(req.user.type == "USER"){
            result = await appointmentDao.getAppointmentHistoryByKeyValue('userId', userId)
        }else if(req.user.type == "ADMIN"){
            result = await appointmentDao.getAppointmentHistoryByKeyValue('doctorId', userId)
        }else if(req.user.type == "SUPERADMIN"){
            result = await appointmentDao.getHistoryAppointments()
        }else{
            throw new Error("User Type not accessible")
        }
        res.locals.rootData = result
        next()

    } catch (error) {
        next(error)
    }
}