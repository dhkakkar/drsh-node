const scheduleDao = require('../../utils/mongodb/dao/schedule.dao')
const appointmentDao = require('../../utils/mongodb/dao/appointment.dao');
const { MongoError } = require('../../utils/handler/error');

const appConfig = require('../../config/appConfig.json')

module.exports.run = async (req, res, next) => {
    try {
        const user = req.user;
        const appointmentId = req.params.appointmentId
        const isAppointmentCancelled = await appointmentDao.updateAppointment({ _id: appointmentId }, { status: "CANCELLED" })
        if (isAppointmentCancelled) {
            // const appointmentDetails = res.locals.appointmentDetails
            const appointmentDetails = await appointmentDao.getAppointmentByKeyValue("_id", req.params.appointmentId)
            if (appointmentDetails.length) {
                await scheduleDao.updateSchedule({ _id: appointmentDetails[0].slotId }, { isBooked: false })
                Object.assign(req.body, {
                    otherParticipants: appointmentDetails.otherParticipants,
                    status: 'booked',
                    title: appointmentDetails.title,
                    description: appointmentDetails.description,
                })

                if (!res.locals.isRescheduling) {
                    const bookingAmount = appointmentDetails[0].amount;
                    const chargedAmount = bookingAmount * (appConfig.cancellationFeePercent / 100)
                    const cancellationFee = bookingAmount - chargedAmount;
                    res.locals.walletRefund = {
                        userId: user._id,
                        amount: cancellationFee,
                        reason: `cancellation charge for appointment ${appointmentId}`
                    }
                }


            }
            res.locals.rootData = {}
            next()

        } else {
            throw new MongoError("Database tot updated")
        }


    } catch (error) {
        next(error)
    }
}