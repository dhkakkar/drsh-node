const appointmentDao = require('../../utils/mongodb/dao/appointment.dao')
module.exports.run = async(req, res, next)=>{
    try {
        const appointmentId = req.params.appointmentId
        const _result = await appointmentDao.getAppointmentByKeyValue('_id', appointmentId)
        const result = JSON.parse(JSON.stringify(_result))
        res.locals.rootData = result[0]
        next()

    } catch (error) {
        next(error)
    }
}