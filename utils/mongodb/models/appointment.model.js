const { Schema, Types, model } = require('mongoose');
const { ObjectId } = Types;

const schema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    slotId: {
        type: ObjectId,
        required: true,
        ref:"schedules"
    },
    meetLink: {
        type: String,
        required: true,
    },
    userId: {
        type: ObjectId,
        required: true,
        ref: "Users"
    },
    doctorId: {
        type: ObjectId,
        required: true,
        ref: "Admins"
    },
    bookedBy: {
        type: String,
        required: true
    },
    bookedPerson: {
        type: ObjectId, // person who logged in while booking
        required: true
    },
    otherParticipants: {
        type: [String] // should be email id only
    },
    amount: {
        type: Number
    },
    cancellationFee: {
        type: Number
    },
    status: {
        type: String,
        default: "BOOKED"
    },
    createdAt: {
        type: Date,
        required: true
    },
    updatedAt: {
        type: Date,
        required: true
    },
    isScheduled: {
        type: Boolean,
        required: true
    }

})


const _model = model('appointments', schema)
module.exports = _model