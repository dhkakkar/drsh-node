require('dotenv').config();

const getEnv = (varable)=>{
    if(process.env[varable]){
        return process.env[varable]
    }else{
        throw new Error(`${varable} is not declared in .env file`)
    }
}
//declare all env file here to access globally from env.js file
module.exports = {
    JWT_SECRET_KEY:getEnv('JWT_SECRET_KEY'),
    MONGOURI : getEnv('MONGOURL'),
    GOOGLE : {
        APIKEY : getEnv("GOOGLE_APIKEY"),
        CALENDAR : {
            ID : getEnv("GOOGLE_CALENDARID"),
            CRED : getEnv("GOOGLE_CRED")
        },
        CLIENT_ID: getEnv('GOOGLE_CLIENTID'),
        CLIENT_SECRET:getEnv('GOOGLE_CLIENTSECRET')
    }
}

