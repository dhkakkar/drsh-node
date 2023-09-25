const moment = require('moment')
const { ValidationError, BadRequestError } = require('../../utils/handler/error')
const appointmentDao = require('../../utils/mongodb/dao/appointment.dao')
const scheduleDao = require('../../utils/mongodb/dao/schedule.dao')
const appConfig = require('../../config/appConfig.json')
const walletDao = require('../../utils/mongodb/dao/wallet.dao')
const httpRequest = require('../../utils/handler/request/http')
module.exports.run = async (req, res, next) => {
    try {
        let userId = req.user._id
        let bookedPerson = req.user._id
        let doctorId = req.body.doctorId
        let bookedBy = "USER"
        if (req.user && req.user.type == "ADMIN") {
            if (req.body.userId) {
                userId = req.body.userId
            } else {
                throw new ValidationError('userId required')
            }
            doctorId = req.user._id; //Admin is doctor
            bookedBy = "ADMIN"
        }

        if (req.user && req.user.type == "SUPERADMIN") {
            if (req.body.userId) {
                userId = req.body.userId
            } else {
                throw new ValidationError('userId required')
            }
            if (req.body.doctorId) {
                doctorId = req.body.doctorId
            } else {
                throw new ValidationError('doctorId required')
            }
            bookedBy = "SUPERADMIN"
        }
        const appointmentData = {
            doctorId: doctorId,
            userId: userId,
            slotId: req.body.slotId,
            date: moment(req.body.date, appConfig.DATE_FORMAT),
            otherParticipants: req.body.otherParticipants || [],
            status: 'booked',
            title: req.body.title || 'Doctor Safe Hand Appointment',
            description: req.body.description || 'No description added',
            isScheduled: true,
            bookedBy,
            bookedPerson,
            meetLink: "NA"
        }
        const slotDeatils = await scheduleDao.getScheduleByKeyValue('_id', req.body.slotId)

        if (slotDeatils.length) {
            const _date = moment(`${moment(slotDeatils[0].date).format("DD/MM/YYYY")} ${slotDeatils[0].fromTime}`, 'DD/MM/YYYY hh:mm A')
            const dateTime = new Date(_date)
            res.locals.wallet = {
                userId,
                reason: req.body.title || 'DrSH Appointment',
                amount: appConfig.slotAmount[`${slotDeatils[0].duration}min`]
            }
            appointmentData.amount = appConfig.slotAmount[`${slotDeatils[0].duration}min`]
            //wallet info
            const _walletData = await walletDao.getWalletByKeyValue("user", userId)
            const walletData = _walletData[0]
            const externalUserID = walletData.externalUserID;
            const walletInfo = await httpRequest("wallet_getByExternalID", null, { params: { externalUserID } })
            if(walletInfo.wallet.balance < appointmentData.amount ){
                throw new BadRequestError("Low balance. Please recharge your wallet")
            }
            // wallet info
            const appointmentSavedRecord = await appointmentDao.saveAppointment(appointmentData)
            scheduleDao.updateSchedule({ _id: req.body.slotId }, { isBooked: true, bookedAt: new Date() })
            res.locals.rootData = appointmentSavedRecord
            res.locals.rootData.dateTime = dateTime
            
            if(res.locals.isRescheduling){
                let appointmentDetails = res.locals.appointmentDetails
                appointmentDetails = appointmentDetails[0]
                const bookingAmount = appointmentDetails.amount;
                const chargedAmount = bookingAmount * (appConfig.rescheduleFeePercent / 100)
                const rescheduleFee = bookingAmount - chargedAmount;

                res.locals.wallet.reason = `reschedule ${res.locals.wallet.reason}`
                res.locals.wallet.amount = res.locals.wallet.amount - rescheduleFee
            }
    
            next()
        } else {
            throw new ValidationError("ScheduleId/slotId is invalid.")
        }


    } catch (error) {
        next(error)
    }
}