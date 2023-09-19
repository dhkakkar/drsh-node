const { NoRecordFoundError } = require('../../handler/error');
const ScheduleModel = require('../models/schedule.model');
const { Types: { ObjectId } } = require('mongoose')

const saveAppointment = async (data) => {
    try {
        data.createdAt = new Date()
        data.updatedAt = new Date()
        const scheduleData = new ScheduleModel(data);
        return scheduleData.save();
    } catch (error) {
        throw error;
    }
};

const saveSchedules = async (data) => {
    try {
        const result = await ScheduleModel.insertMany(data)
        return result
    } catch (error) {
        throw error;
    }
};

const getScheduleByKeyValue = async (key, value) => {
    try {
        const query = {};
        if (key === '_id' || key === 'doctorId' || key === 'bookedPerson') value = new ObjectId(value);
        query[key] = value;

        const user = await ScheduleModel.find(query).exec();
        const output = JSON.parse(JSON.stringify(user));
        return output;
    } catch (error) {
        throw error;
    }
};

const getDoctorScheduleByDateRange = async (doctorId, dateRange) => {
    const result = await ScheduleModel.find({
        doctorId,
        date: {
            $gte: dateRange.fromDate,
            $lte: dateRange.toDate
        },
        isActive: true,
    }).exec()
    return JSON.parse(JSON.stringify(result))
}

const getAllScheduleByDateRange = async ( dateRange) => {
    const result = await ScheduleModel.find({
        date: {
            $gte: dateRange.fromDate,
            $lte: dateRange.toDate
        },
        isActive: true,
    }).exec()
    return JSON.parse(JSON.stringify(result))
}

const updateSchedule = async (condition, changes) => {
    try {
        const update = await ScheduleModel.updateOne(condition, changes).exec()
        return update.acknowledged
    } catch (error) {
        throw error
    }
}

module.exports = {
    saveAppointment,
    getScheduleByKeyValue,
    saveSchedules,
    getDoctorScheduleByDateRange,
    updateSchedule,
    getAllScheduleByDateRange
};
