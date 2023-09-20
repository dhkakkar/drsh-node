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
  },
  loginType: {
    type: [String],
    required: true
  },
  googleIdToken: {
    type: String
  },
  googleId: {
    type: String
  },
  profileImage: {
    type: String
  },
  mobile: {
    type: String,
  },
  dateOfBirth: {
    type:String,
  },
  address: {
    type:String,
  },
  city: {
    type:String,
  },
  state: {
    type:String,
  },
  country: {
    type:String,
  },
  zipcode: {
    type:String,
  },
  password: {
    type: String,
  },
  type: {
    type: String,
    default: "USER"
  },
  createdOn: {
    type: Date,
    required: true,
  },
  modifiedOn: {
    type: Date,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
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

const _model = model('Users', schema);
module.exports = _model;
