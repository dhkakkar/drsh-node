const { UnauthorizedError } = require("../../../utils/handler/error")
const { verifyOtp } = require("../../../utils/mongodb/dao/otp.dao")
const { getUserByKeyValue } = require("../../../utils/mongodb/dao/user.dao")

module.exports.run = async (req, res, next) => {
    try {
        const otp = req.body.otp
        const type = req.params.otpType
        const user = req.body.mobile
        const isVerified = await verifyOtp({
            otp, type, user
        })
        if (isVerified) {
            res.locals.displayMessage = "OTP verified Successfully"
            let user = isVerified;
            if(!user._id){
                user = await getUserByKeyValue("mobile", req.body.mobile)
                user = user[0]
            }
            const userData = JSON.parse(JSON.stringify(user));
    
            delete userData.password
            delete userData.__v
            res.user = userData
            res.locals.rootData = userData
            
            
        } else {
            throw UnauthorizedError("OTP not verified")
        }

        next()
    } catch (error) {
        next(error)
    }
}