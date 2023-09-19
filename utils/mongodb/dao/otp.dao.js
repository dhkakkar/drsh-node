const { UnauthorizedError } = require('../../handler/error')
const OtpModel = require('../models/otp.model')
const UserModel = require('../models/user.model')
const UnverifiedUser = require('../models/unverifiedUser.model')
const moment = require('moment')

const saveOtp = (data) => {
    try {
        const otpData = new OtpModel({
            user: data.user,
            otp: data.otp,
            type: data.type,
            createdAt: new Date(),
            expiredAt: new Date(new Date().getTime() + 5 * 60000),
        })

        otpData.save()
        return
    } catch (error) {
        throw error
    }

}

const verifyOtp = async (reqBody) => {
    try {
        let otpData = await OtpModel.findOne({ user: reqBody.user, isVerified: false, type: reqBody.type }).sort({ createdAt: -1 }).exec()
        if (otpData) {
            let currentTime = new Date(moment())
            let expireTime = new Date(otpData.expiredAt)
            if (currentTime < expireTime) {
                if (reqBody.otp == otpData.otp) {
                    OtpModel.deleteMany({ user: reqBody.user, isVerified: false, type: reqBody.type })
                    if (reqBody.type == "SMS_SIGNUP") {
                        // await UserModel.updateOne({ email: reqBody.user }, { isVerified: true })


                        const _unverifiedUser = await UnverifiedUser.findOne({
                            $or: [
                                { email: reqBody.user },
                                { mobile: reqBody.user }
                            ]
                        }).exec();



                        if (_unverifiedUser) {
                            const unverifiedUser = JSON.parse(JSON.stringify(_unverifiedUser))
                            delete unverifiedUser._id;
                            unverifiedUser.isVerified = true
                            unverifiedUser.modifiedOn = new Date()
                            unverifiedUser.createdOn = new Date()
                            const newUser = new UserModel(unverifiedUser);
                            const result = await newUser.save()
                            return result
                        }
                    }
                    return true
                } else {
                    throw new UnauthorizedError("Worng OTP")
                }
            } else {
                throw new UnauthorizedError("OTP expired")
            }
        } else {
            throw new UnauthorizedError("Invalid OTP")
        }

    } catch (error) {
        throw error;
    }
}

module.exports = {
    saveOtp,
    verifyOtp
}