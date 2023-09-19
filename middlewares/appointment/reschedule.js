const scheduleDao = require('../../utils/mongodb/dao/schedule.dao')
const appointmentDao = require('../../utils/mongodb/dao/appointment.dao');
const { BadRequestError } = require('../../utils/handler/error');
module.exports.run=async(req, res, next)=>{
    try {
        res.locals.isRescheduling = true;
        scheduleDao.updateSchedule({ _id: req.body.slotId }, { isBooked: false, bookedAt: new Date() })
        const schedule = await scheduleDao.getScheduleByKeyValue("_id",req.body.slotId )
        const appointmentDetails = await appointmentDao.getAppointmentByKeyValue("_id", req.params.appointmentId)
        if(schedule[0].duration == appointmentDetails[0].slotId.duration){
            res.locals.appointmentDetails = JSON.parse(JSON.stringify(appointmentDetails))
            next()
        }else{
            throw new BadRequestError("Please schedule with a same timing")
        }
        
    } catch (error) {
        next(error)
    }
}