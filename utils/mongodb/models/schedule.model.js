const { Schema, Types, model } = require('mongoose');
const { ObjectId } = Types;

const schema = new Schema({
    date:{
        type:Date,
        required:true
    },
    day : {
        type:String,
        required: true
    },
    fromTime:{
        type:String,
        required:true
    },
    toTime:{
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required:true
    },
    doctorId: {
        type: ObjectId,
        required: true,
        ref:"Admins"
    },
    isBooked: {
        type: Boolean,
        required:false
    },
    createdAt: {
        type: Date,
        required: true
    },
    bookedAt:{
        type: Date
    },
    updatedAt: {
        type: Date,
        required: true
    },
    isActive:{
        type:Boolean,
        default: true
    }

})


const _model = model('schedules', schema)
module.exports = _model