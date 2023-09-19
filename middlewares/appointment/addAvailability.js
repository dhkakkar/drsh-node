const availabilityDao = require('../../utils/mongodb/dao/availability.dao')
const moment = require('moment')
module.exports.run = async(req, res, next)=>{
    try {
        const availability = req.body;
        availability.fromDate = moment(req.body.fromDate, "DD/MM/YYYY");
        availability.toDate = moment(req.body.toDate, "DD/MM/YYYY");
        availabilityDao.saveAvailability(availability)
        next()

    } catch (error) {
        next(error)
    }
}