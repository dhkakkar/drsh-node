const moment = require("moment");
const appConfig = require('../../config/appConfig.json')
const scheduleDao = require('../../utils/mongodb/dao/schedule.dao');
const { BadRequestError } = require("../../utils/handler/error");
module.exports.run = async (req, res, next) => {
    try {
        let doctorId = req.body.doctorId
        // if (req.user.type == "ADMIN") {
        //     req.user._id
        // } else if (req.user.type == "SUPERADMIN") {
        //     userId = req.body.doctorId
        // } else {
        //     throw new Error("User Type not accessible")
        // }
        /**
         * 0 = sunday
         * 1 = monday
         * 2 = tuesday
         * 3 = wednesday
         * 4 = thurday
         * 5 = friday
         * 6 = saturday
         */
        const fromDate = moment(req.body.fromDate, "DD/MM/YYYY");
        const toDate = moment(req.body.toDate, "DD/MM/YYYY");
        // const fromDate = moment(req.body.fromDate);
        // const toDate = moment(req.body.toDate);
        const now = fromDate.clone();
        const schedules = []
        while (now.isSameOrBefore(toDate)) {
            let day
            let _day
            switch (now.day()) {
                case 0:
                    day = req.body.availability?.sunday ? req.body.availability.sunday : null
                    _day = "Sunday"
                    break;

                case 1:
                    day = req.body.availability?.monday ? req.body.availability.monday : null
                    _day = "Monday"
                    break;

                case 2:
                    day = req.body.availability?.tuesday ? req.body.availability.tuesday : null
                    _day = "Tuesday"
                    break;

                case 3:
                    day = req.body.availability?.wednesday ? req.body.availability.wednesday : null
                    _day = "Wednesday"
                    break;

                case 4:
                    day = req.body.availability?.thurday ? req.body.availability.thurday : null
                    _day = "Thursday"
                    break;

                case 5:
                    day = req.body.availability?.friday ? req.body.availability.friday : null
                    _day = "Friday"
                    break;

                case 6:
                    day = req.body.availability?.saturday ? req.body.availability.saturday : null
                    _day = "Saturday"
                    break;

                default:
                    day = 'No Date'
                    break;
            }
            const date = now.format('DD/MM/YYYY');

            if (day && day !== null) {
                if (day.length) {

                    for (let i = 0; i < day.length; i++) {
                        let fromTime = moment(`${now.format('DD/MM/YYYY')} ${day[i].fromTime}`, 'DD/MM/YYYY hh:mm A')
                        const toTime = moment(`${now.format('DD/MM/YYYY')} ${day[i].toTime}`, 'DD/MM/YYYY hh:mm A')
                        const slotTime = day[i].slotTime

                        while (fromTime.isBefore(toTime)) {
                            const obj = {}
                            const _newTime = fromTime.clone()
                            const newTime = _newTime.add(slotTime, 'minutes')
                            obj.fromTime = moment(fromTime).format('hh:mm A')
                            obj.toTime = moment(newTime).format('hh:mm A')

                            obj.date = new Date(now)
                            obj.duration = slotTime
                            obj.createdAt = new Date()
                            obj.updatedAt = new Date()
                            obj.doctorId = doctorId
                            obj.day = _day
                            schedules.push(obj)
                            fromTime = newTime
                        }

                    }
                }

            }

            now.add(1, 'days');
        }
        const result = await scheduleDao.saveSchedules(schedules)
        res.locals.rootData = result
        next()
    } catch (error) {
        next(error)
    }
}