const { UnauthorizedError } = require("../../../utils/handler/error")
const sendOTP = require("../../../utils/helper/sendOTPSms")
const { saveOtp } = require("../../../utils/mongodb/dao/otp.dao")
const { getUserByKeyValue } = require("../../../utils/mongodb/dao/user.dao")

const digitOfOTP = 8

module.exports.run = async (req, res, next) => {
    try {
        if (!res.ref || !res.ref.createOtp) {
            return next()
        }
        const ref = res.ref
        console.log(ref)

        const _decimal = Math.pow(10, digitOfOTP - 1)
        const otp = Math.floor(_decimal + Math.random() * (9 * _decimal))
        await sendOTP(otp, ref.mobile)

        const otpData = {
            user: ref.mobile,
            otp: otp,
            type: ref.type,
            createdAt: new Date(),
            expiredAt: new Date(new Date().getTime() + 5 * 60000), //OTP expire in 5 min
        }
        await saveOtp(otpData)
        res.locals.rootData = "OTP Sent"
        res.locals.displayMessage = "OTP Sent Successfully"
        res.locals.skipCreateAuthToken = true
        next()


    } catch (error) {
        next(error)
    }
}