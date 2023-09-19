const { Schema, Types, model, default: mongoose } = require('mongoose');
const { ObjectId } = Types;

const schema = new Schema({
  user: {
    type: ObjectId,
    required: true,
  },
  platformUserId:{
    type:String,
    required:true
  },
  walletId:{
    type:String,
    required:true
  },
  firstName: {
    type: String,
    required:true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required:true
  },
  phoneNumber: {
    type: String,
    required:true
  },
  externalUserID: {
    type: String
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
});
schema.pre('updateOne', async function (next) {
  const data = this;
  data._update.modifiedOn = new Date();
  next();

});

const _model = model('wallets', schema);
module.exports = _model;
