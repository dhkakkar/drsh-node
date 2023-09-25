const availabilityDao = require('../../utils/mongodb/dao/availability.dao')
const moment = require('moment')
module.exports.run = async (req, res, next) => {
    try {
        const availabilityId = req.params.availabilityId
        const existAvailability = res.locals.rootData.availability;

        const newAvailability = req.body.availability


        const availability = Object.assign(existAvailability, newAvailability);
        // availability.fromDate = moment(req.body.fromDate, "DD/MM/YYYY");
        // availability.toDate = moment(req.body.toDate, "DD/MM/YYYY");
        await availabilityDao.updateAvailabilityById(availabilityId, availability)
        next()

    } catch (error) {
        next(error)
    }
}