const { ValidationError } = require("../../utils/handler/error");
const adminDao = require('../../utils/mongodb/dao/admin.dao')
const userDao = require('../../utils/mongodb/dao/user.dao')
const appointmentDao = require('../../utils/mongodb/dao/appointment.dao')
const appConfig = require('../../config/appConfig.json')
const moment = require('moment');

module.exports.run = async (req, res, next) => {
    try {
        const userId = req.user._id
        let appointmentResult;
        let totalAdmin;
        let totalUser;
        let result = {}
        if(req.user.type == "USER"){
            result.appointmentTotalResult = await appointmentDao.countTotalApointment('userId', userId)
            result.appointmentResult = await appointmentDao.countTodayApointment('userId', userId)
            totalAdmin = 0;
            totalUser = 0;
        }else if(req.user.type == "ADMIN"){
            result.appointmentResult = await appointmentDao.countTodayApointment('doctorId', userId)
            result.appointmentTotalResult = await appointmentDao.countTotalApointment('doctorId', userId)
            totalAdmin = 0;
            totalUser = 0;
        }else if(req.user.type == "SUPERADMIN"){
            result.appointmentResult = await appointmentDao.countAllTodayApointment()
            result.totalAdmin = await adminDao.countAllAdmin();
            result.totalUser = await userDao.countAllUser();
        }else{
            throw new Error("User Type not accessible")
        }
        res.locals.rootData = result
        next()
    } catch (error) {
        next(error);
    }
};