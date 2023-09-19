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
  loginType:{
    type:[String],
    required:true
  },
  googleIdToken:{
    type:String
  },
  googleId:{
    type:String
  },
  profileImage:{
    type:String
  },
  mobile: {
    type: String,
  },
  password: {
    type: String,
  },
  type:{
    type:String,
    default:"USER"
  },
});
schema.pre('save', async function (next) {
  const data = this;    
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

const _model = model('unverifiedUsers', schema);
module.exports = _model;
