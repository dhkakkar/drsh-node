const { Schema, Types, model, default: mongoose } = require('mongoose');
const { ObjectId } = Types;

const { encryptText } = require('../../services/bcryptText');

const schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    profileImage: {
        type: String
    },
    mobile: {
        type: String,
    },
    daysAvailable: {
        type: [String],
        required: true
    },
    timeAvailablePerWeek: {
        type: [String],
        required: true
    },
    password: {
        type: String,
    },
    type: {
        type: String,
        default: "ADMIN"
    },
    speciality: {
        type: String,
        required: true
    },
    qualification: {
        type: String,
        required: true
    },
    createdOn: {
        type: Date,
        required: true,
    },
    modifiedOn: {
        type: Date,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
});
schema.pre('save', async function (next) {
    const data = this;
    if (!data.password) {
        return next()
    }
    if (this.isModified('password') || this.isNew) {
        let pw = await encryptText(data.password);
        data.password = pw;
        data.createdOn = new Date()
        data.modifiedOn = new Date()
        next();
    } else {
        return next();
    }
});
schema.pre('updateOne', async function (next) {
    const data = this;
    if (data._update.password) {
      let pw = await encryptText(data._update.password);
      data._update.password = pw;
  
    }
    data._update.modifiedOn = new Date();
    next();
  
  });

const _model = model('Admins', schema);
module.exports = _model;
