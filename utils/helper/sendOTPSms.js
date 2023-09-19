const appConfig = require('../../config/appConfig.json');
const axios = require('axios').default
const externalAPIs = appConfig.ExtAPIs

module.exports = (otp, mobileNo) => {
    try {
        const apiConfig = externalAPIs.sms
        return new Promise((resolve, reject) => {
            axios({
                method: apiConfig.method,
                url: apiConfig.url,
                data: {
                    otpCode: otp,
                    destinationNumber: mobileNo
                },
                headers:{
                    Apikey:process.env.EXT_API_KEY
                }
            }).then((res) => {
                console.log(res.data)
                resolve(res.data)
            }).catch(err=>{
                reject(err)
            })
        })

    } catch (error) {
        throw error;
    }
}
