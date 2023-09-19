const moment = require('moment')
const availabilityDao = require('../../utils/mongodb/dao/availability.dao');
const { BadRequestError } = require('../../utils/handler/error');
module.exports.run = async (req, res, next) => {
    try {
        const fromDate = moment(req.body.fromDate, "DD/MM/YYYY").add('1', 'days');
        console.log(fromDate)
        const date = new Date(fromDate)
        const doctorId = req.user._id
        const count = await availabilityDao.getAvailabilityCountBellowFromDate(date, doctorId)
        console.log(count)
        if (count > 0) {
            throw new BadRequestError("You have already added availability with " + req.body.fromDate, count)
        }
        next()
    } catch (error) {
        next(error)
    }
}