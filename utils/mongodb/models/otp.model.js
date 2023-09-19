const { Schema, Types, model } = require('mongoose');
const { ObjectId } = Types;

const schema = new Schema({
    otp: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true,
    },
    via: {
        type: String,
        default: "SMS" // "EMAIL"
    },
    type: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    expiredAt: {
        type: Date,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    }

})

const _model = model('otps', schema)
module.exports = _model