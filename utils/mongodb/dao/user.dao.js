const { NoRecordFoundError } = require('../../handler/error');
const { encryptText } = require('../../services/bcryptText');
const UserModel = require('../models/user.model');
const UnverifiedUserModel = require('../models/unverifiedUser.model');
const { ObjectId } = require('mongoose').Types;

const saveUser = async (data) => {
  try {
    userData = new UserModel(data);
    return userData.save();
  } catch (error) {
    throw error;
  }
};

const saveUnverifiedUser = async (data) => {
  try {
    const unverifiedUser = await UnverifiedUserModel.findOne({ mobile: data.mobile })
    if (unverifiedUser) {
      UnverifiedUserModel.updateOne({ _id: new ObjectId(unverifiedUser._id) }, { password: data.password }).exec()
    } else {
      const newUnverifiedUser = new UnverifiedUserModel(data);
      const result = await newUnverifiedUser.save()
      const _result = JSON.parse(JSON.stringify(result))
      delete _result.password
      return _result;
    }
    _unverifiedUser = JSON.parse(JSON.stringify(unverifiedUser))
    delete _unverifiedUser.password
    return _unverifiedUser
  } catch (error) {
    throw error;
  }
};

const loginUser = async (data) => {
  try {
    return UserModel.findOne({ mobile: data.mobile });
  } catch (error) {
    throw error;
  }
};

const updateUser = async (data, id) => {
  try {
    const result = await UserModel.updateOne({ _id: id }, data, {
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
    const result = await UserModel.updateOne(condition, data, {
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

const getUserByKeyValue = async (key, value, pagination) => {
  try {
    const query = {};
    if (key === '_id') value = new ObjectId(value);
    query[key] = value;
    let user
    if(pagination){
      user = await UserModel.find(query).skip(pagination.skip).limit(pagination.limit).exec();
    }else{
      user = await UserModel.find(query).exec();
    }
    const output = JSON.parse(JSON.stringify(user));
    return output;
  } catch (error) {
    throw error;
  }
};

const getUnverifiedUserByKeyValue = async (key, value)=>{
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
      const user = await UserModel.find({ $or: query }).exec();
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
    const result = await UserModel.updateOne({ _id: new ObjectId(id) }, data).exec()
    return result.acknowledged
  } catch (error) {
    throw error;
  }
};


const countAllUser = async () => {
  try {
    const result = await UserModel.count({
      isActive: true
    }).exec();
    return result;
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
  saveUnverifiedUser,
  getUnverifiedUserByKeyValue,
  updateUserById,
  countAllUser
};
