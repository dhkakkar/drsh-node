const moment = require('moment')
const scheduleDao = require('../../utils/mongodb/dao/schedule.dao')
module.exports.run = async(req, res, next) => {
    try {
        let today = moment(moment().format("DD-MM-YYYY"),"DD-MM-YYYY")
        let _fromDate = today.clone()
        let _toDate = today.add(30, 'days')
        if (req.query.fromDate) _fromDate = moment(req.query.fromDate, "DD-MM-YYYY")
        if (req.query.toDate) _toDate = moment(req.query.toDate, "DD-MM-YYYY")

        const fromDate = new Date(_fromDate)
        const toDate = new Date(_toDate)

        const result = await scheduleDao.getAllScheduleByDateRange({fromDate, toDate})
        result.forEach(e=>{
            e.date=moment(e.date).format("DD/MM/YYYY")
        })
        const startDate = moment(fromDate)
        const now = startDate.clone(), dates = [];
        const dateWiseSchedule = []
        while (now.isSameOrBefore(toDate)) {
            let day
            switch (now.day()) {    
                case 0:
                    day = "Sunday"
                    break;

                case 1:
                    day = "Monday"
                    break;

                case 2:
                    day = "Tuesday"
                    break;

                case 3:
                    day = "Wednesday"
                    break;

                case 4:
                    day = "Thursday"
                    break;

                case 5:
                    day = "Friday"
                    break;

                case 6:
                    day = "Saturday"
                    break;

                default:
                    day = 'No Date'
                    break;
            }
            const date = now.format('DD/MM/YYYY');
            const schedules = result.filter(e=>e.date == date)
            if(schedules.length > 0){
                dateWiseSchedule.push({
                    date,
                    day,
                    schedules
                })
            }
            now.add(1, 'days');
        }
        res.locals.rootData = dateWiseSchedule;
        next()

    } catch (error) {
        next(error)
    }
}