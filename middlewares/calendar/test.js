const env = require('@env');
const { addEvent, getEventList } = require('../../utils/services/calender.servive');
const { ValidationError } = require('../../utils/handler/error');
const appConfig = require('../../config/appConfig.json')
const {v4:uuid} = require('uuid')
const moment = require('moment')

module.exports.run = async (req, res, next) => {
    try {
        
        res.locals.rootData = "No condition matched";
        console.log(req.params.calenderType)
        if(req.params.calenderType == "addToCalendar"){
            
            const result = await addEvent()
            console.log(result)
            res.locals.rootData = result;
        }
        
        if(req.params.calenderType == "getEventList"){
            const result = await getEventList()
            console.log(result)
            res.locals.rootData = result;
        }
        
        next()
    } catch (error) {
        const err =  new ValidationError("Google error",error  )
        next(err)
    }
}