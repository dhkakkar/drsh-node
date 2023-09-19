const { Schema, Types, model } = require('mongoose');
const { ObjectId } = Types;

const slotWise = new Schema({
    fromTime: {
        type:String,
    },
    toTime:{
        type: String
    },
    slotTime:{
        type:Number
    }
})

const dayWiseAvailability=new Schema({
    sunday:[slotWise],
    monday:[slotWise],
    tuesday:[slotWise],
    wednesday:[slotWise],
    thursday:[slotWise],
    friday:[slotWise],
    saturday:[slotWise],
})

const schema = new Schema({
    fromDate:{
        type:Date,
        required:true
    },
    toDate:{
        type: Date,
        required: true
    },
    doctorId: {
        type: ObjectId,
        required: true,
        ref:"Admins"
    },
    availability: dayWiseAvailability

})


const _model = model('availability', schema)
module.exports = _model