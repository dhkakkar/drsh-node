const AvailabilityModel = require('../models/availability.model');
const {Types:{ObjectId}} = require('mongoose')

const saveAvailability = async (data) => {
    try {
        const result = new AvailabilityModel(data);
        return result.save();
    } catch (error) {
        throw error;
    }
};

const getAvailabilityByDoctorId = async (doctorId) => {
    try {
        let result = await AvailabilityModel.find({doctorId:new ObjectId(doctorId)}).populate('doctorId').exec();
        result = JSON.parse(JSON.stringify(result))
        return result
    } catch (error) {
        throw error;
    }
};

const getAvailabilityById = async (id) => {
    try {
        let result = await AvailabilityModel.find({_id:new ObjectId(id)}).populate('doctorId').exec();
        result = JSON.parse(JSON.stringify(result))
        return result
    } catch (error) {
        throw error;
    }
};

const getAllAvailability = async () => {
    try {
        let result = await AvailabilityModel.find().populate('doctorId').exec();
        result = JSON.parse(JSON.stringify(result))
        return result
    } catch (error) {
        throw error;
    }
};

const getAvailabilityCountBellowFromDate = async (date, doctorId) => {
    try {
        const _date = new Date(date).toISOString()
        console.log(_date)
        const result = await AvailabilityModel.count({
            toDate: { $gte: date }, doctorId:new ObjectId(doctorId)
        }).exec()
        return result
    } catch (error) {
        throw error
    }
}


module.exports = {
    saveAvailability,
    getAvailabilityByDoctorId,
    getAvailabilityById,
    getAllAvailability,
    getAvailabilityCountBellowFromDate
}