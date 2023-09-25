const moment = require('moment');
const { NoRecordFoundError } = require('../../handler/error');
const AppointmentModel = require('../models/appointment.model');
const { Types: { ObjectId } } = require('mongoose')

const saveAppointment = async (data) => {
  try {
    data.createdAt = new Date()
    data.updatedAt = new Date()
    const appointmentData = new AppointmentModel(data);
    return appointmentData.save();
  } catch (error) {
    throw error;
  }
};

const getAppointmentHistoryByKeyValue = async (key, value) => {
  try {
    const query = {};
    const today = moment().format("YYYY-MM-DD");
    // let tomorrow = moment().add(1, 'days')
    // tomorrow = tomorrow.format("YYYY-MM-DD")
    if (key === '_id' || key === 'doctorId' || key === 'bookedPerson') value = new ObjectId(value);
    query[key] = value;
    const user = await AppointmentModel.find(query).populate('userId').populate('doctorId').populate("slotId").exec();
    const output = JSON.parse(JSON.stringify(user));
    return output;
  } catch (error) {
    throw error;
  }
};

const getHistoryAppointments = async () => {
  try {
    const query = {};
    const today = moment().format("YYYY-MM-DD");
    const user = await AppointmentModel.find(query).populate('userId').populate('doctorId').populate("slotId").exec();
    const output = JSON.parse(JSON.stringify(user));
    return output;
  } catch (error) {
    throw error;
  }
}


const getAppointmentByKeyValue = async (key, value) => {
  try {
    const query = {};
    if (key === '_id' || key === 'doctorId' || key === 'bookedPerson') value = new ObjectId(value);
    query[key] = value;

    const user = await AppointmentModel.find(query).populate('userId').populate('doctorId').populate("slotId").exec();
    const output = JSON.parse(JSON.stringify(user));
    return output;
  } catch (error) {
    throw error;
  }
};

const getTodayAppointmentByKeyValue = async (key, value) => {
  try {
    const query = {};
    const today = moment().format("YYYY-MM-DD");
    let tomorrow = moment().add(1, 'days')
    tomorrow = tomorrow.format("YYYY-MM-DD")
    if (key === '_id' || key === 'doctorId' || key === 'bookedPerson') value = new ObjectId(value);
    query[key] = value;
    query['date'] = {
      $gte: new Date(today), 
      $lt: new Date(tomorrow)
    };
    const user = await AppointmentModel.find(query).populate('userId').populate('doctorId').populate("slotId").exec();
    const output = JSON.parse(JSON.stringify(user));
    return output;
  } catch (error) {
    throw error;
  }
};

const countTodayApointment = async (key, value) => {
  try {
    const query = {};
    const today = moment().format("YYYY-MM-DD");
    let tomorrow = moment().add(1, 'days')
    tomorrow = tomorrow.format("YYYY-MM-DD")

    if (key === '_id' || key === 'doctorId' || key === 'bookedPerson') value = new ObjectId(value);
    query[key] = value;
    query['date'] = {
      $gte: new Date(today), 
      $lt: new Date(tomorrow)
    };
    const result = await AppointmentModel.count(query).populate('userId').populate('doctorId').populate("slotId").exec();

    return result;
  } catch (error) {
    throw error;
  }
};


const countTotalApointment = async (key, value) => {
  try {
    const query = {};
    if (key === '_id' || key === 'doctorId' || key === 'bookedPerson') value = new ObjectId(value);
    query[key] = value;
    const result = await AppointmentModel.count(query).populate('userId').populate('doctorId').populate("slotId").exec();

    return result;
  } catch (error) {
    throw error;
  }
};


const countAllTodayApointment = async () => {
  try {
    const query = {};
    const today = moment().format("YYYY-MM-DD");
    let tomorrow = moment().add(1, 'days')
    tomorrow = tomorrow.format("YYYY-MM-DD")

    query['date'] = {
      $gte: new Date(today), 
      $lt: new Date(tomorrow)
  };
    const result = await AppointmentModel.count(query).populate('userId').populate('doctorId').populate("slotId").exec();
    return result;
  } catch (error) {
    throw error;
  }
};
const getAllTodayAppointments = async () => {
  try {
    const query = {};
    const today = moment().format("YYYY-MM-DD");
    let tomorrow = moment().add(1, 'days')
    tomorrow = tomorrow.format("YYYY-MM-DD")

    query['date'] = {
      $gte: new Date(today), 
      $lt: new Date(tomorrow)
    };
    const user = await AppointmentModel.find(query).populate('userId').populate('doctorId').populate("slotId").exec();
    const output = JSON.parse(JSON.stringify(user));
    return output;
  } catch (error) {
    throw error;
  }
}

const getAllAppointments = async () => {
  try {
    const user = await AppointmentModel.find().populate('userId').populate('doctorId').populate("slotId").exec();
    const output = JSON.parse(JSON.stringify(user));
    return output;
  } catch (error) {
    throw error;
  }
}

const updateAppointment = async (condition, changes) => {
  try {
    const update = await AppointmentModel.updateOne(condition, changes).exec()
    return update.acknowledged
  } catch (error) {
    throw error
  }
}

module.exports = {
  saveAppointment,
  getAppointmentHistoryByKeyValue,
  getHistoryAppointments,
  getAppointmentByKeyValue,
  updateAppointment,
  getAllTodayAppointments,
  getAllAppointments,
  getTodayAppointmentByKeyValue,
  countTodayApointment,
  countTotalApointment,
  countAllTodayApointment
};
