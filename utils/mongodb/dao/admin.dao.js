const { NoRecordFoundError } = require('../../handler/error');
const { encryptText } = require('../../services/bcryptText');
const AdminModel = require('../models/admin.model');
const { ObjectId } = require('mongoose').Types;

const saveUser = async (data) => {
  try {
    data.createdOn = new Date(),
      data.modifiedOn = new Date(),
      userData = new AdminModel(data);
    return userData.save();
  } catch (error) {
    throw error;
  }
};

const loginUser = async (data) => {
  try {
    return AdminModel.findOne({ mobile: data.mobile });
  } catch (error) {
    throw error;
  }
};

const updateUser = async (data, id) => {
  try {
    const result = await AdminModel.updateOne({ _id: id }, data, {
      returnDocument: 'after',
    }).exec();
    if (result.matchedCount > 0) {
      if (result.acknowledged) {
        return;
      } else {
        const err = new NoRecordFoundError('Error while updating the data');
        throw err;
      }
    } else {
      const err = new NoRecordFoundError('No record match with this id');
      throw err;
    }
  } catch (error) {
    throw error;
  }
};
const updateUserByCondition = async (condition, data) => {
  try {
    if (data.password) {
      const pwd = await encryptText(data.password)
      data.password = pwd
    }
    const result = await AdminModel.updateOne(condition, data, {
      returnDocument: 'after',
    }).exec();
    if (result.matchedCount > 0) {
      if (result.acknowledged) {
        return;
      } else {
        const err = new NoRecordFoundError('Error while updating the data');
        throw err;
      }
    } else {
      const err = new NoRecordFoundError('No record match');
      throw err;
    }
  } catch (error) {
    throw error;
  }
};

const getUserByKeyValue = async (key, value) => {
  try {
    const query = {};
    if (key === '_id') value = new ObjectId(value);
    query[key] = value;
    query.isDeleted = false
    query.isActive = true
    const user = await AdminModel.find(query).exec();
    const output = JSON.parse(JSON.stringify(user));
    return output;
  } catch (error) {
    throw error;
  }
};

const getAllUserByKeyValue = async (key, value) => {
  try {
    const query = {};
    if (key === '_id') value = new ObjectId(value);
    query[key] = value;
    const user = await AdminModel.find(query).exec();
    const output = JSON.parse(JSON.stringify(user));
    return output;
  } catch (error) {
    throw error;
  }
};

const getAllUsers = async () => {
  try {
    const user = await AdminModel.find({
      isDeleted: false, type: "ADMIN"
    }).exec();
    const output = JSON.parse(JSON.stringify(user));
    if (output.lenght > 0) {
      output.forEach(e => {
        if (e.type == "SUPERADMIN")
          delete e
      })
    }
    return output;
  } catch (error) {
    throw error;
  }
};

const countAllAdmin = async () => {
  try {
    const user = await AdminModel.count({
      isActive: true, isDeleted: false, type: "ADMIN"
    }).exec();
    return user;
  } catch (error) {
    throw error;
  }
};

const getUnverifiedUserByKeyValue = async (key, value) => {
  try {
    const query = {};
    if (key === '_id') value = new ObjectId(value);
    query[key] = value;
    const user = await UnverifiedUserModel.find(query).exec();
    const output = JSON.parse(JSON.stringify(user));
    return output;
  } catch (error) {
    throw error;
  }
}


const getUserKeysValue = async (keys, value) => {
  try {
    const query = [];
    if (Array.isArray(keys)) {
      keys.forEach((key) => {
        const q = {};
        q[key] = value;
        query.push(q);
      });
      const user = await AdminModel.find({ $or: query }).exec();
      const output = JSON.parse(JSON.stringify(user));
      return output;
    } else {
      throw new Error('keys should be an array');
    }
  } catch (error) {
    throw error;
  }
};


const updateUserById = async (id, data) => {
  try {
    data = { ...data, ...{ modifiedOn: new Date() } }
    const result = await AdminModel.updateOne({ _id: new ObjectId(id) }, data).exec()
    
    return result.acknowledged
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getUserByKeyValue,
  saveUser,
  loginUser,
  updateUser,
  getUserKeysValue,
  updateUserByCondition,
  getUnverifiedUserByKeyValue,
  getAllUserByKeyValue,
  getAllUsers,
  countAllAdmin,
  updateUserById
};
