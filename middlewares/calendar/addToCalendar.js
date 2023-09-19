const env = require('@env');
const { addEvent, getEventList } = require('../../utils/services/calendar.service');
const { ValidationError } = require('../../utils/handler/error');
const appConfig = require('../../config/appConfig.json')
const { v4: uuidv4 } = require('uuid')
const moment = require('moment')
const userDao = require('../../utils/mongodb/dao/user.dao')
const adminDao = require('../../utils/mongodb/dao/admin.dao')
const appointmentDao = require('../../utils/mongodb/dao/appointment.dao')

module.exports.run = async(req, res, next)=>{
    try {
        const calenderData = res.locals.rootData

        const event = {
            summary: calenderData.title,
            // location: "Online", //should be defult location of doctor
            description: calenderData.description,
            start: {
                dateTime: new Date(calenderData.dateTime),
                timeZone: appConfig.TIME_ZONE,
            },
            end: {
                dateTime: new Date(moment(calenderData.dateTime).add(30,'minutes')),
                timeZone: appConfig.TIME_ZONE,
            },
            sequence:1,
            attendees: [{email:"admin@cluenut.com"}],

            reminders: {
                useDefault: false,
                overrides: [
                    { method: "email", minutes: 24 * 60 },
                    { method: "popup", minutes: 10 },
                ],
            },
            conferenceData: {
                createRequest: {
                    conferenceSolutionKey: {
                        type: "hangoutsMeet",
                    },
                    requestId: uuidv4(),
                },
            },

        };

        let user = await userDao.getUserByKeyValue("_id", calenderData.userId)
        let doctor = await adminDao.getUserByKeyValue("_id", calenderData.doctorId)
        if(user.length){
            if(user[0].email)
                event.attendees.push({email:user[0].email})
        }
        if(doctor.length){
            if(doctor[0].email)
                event.attendees.push({email:doctor[0].email})
        }

        const result = await addEvent(event)
        const meetLink = result.hangoutLink;
        calenderData.meetLink = meetLink
        appointmentDao.updateAppointment({_id:calenderData._id},{meetLink})
        // const result = await getEventList()
        // res.locals.rootData = result
        next()
    } catch (error) {
        next(error)
    }
}

