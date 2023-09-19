const { ValidationError } = require("../../utils/handler/error");
const userDao = require('../../utils/mongodb/dao/user.dao')

module.exports.run = async (req, res, next) => {
    try {
        if (req.params.loginType != "SMSOTP") {
            next();
            return;
        }

        const saveData = {
            name: req.body.name,
            mobile: req.body.mobile,
            loginType: ["SMSOTP"],
            password: req.body.password,
            createdOn: new Date(),
            modifiedOn: new Date(),
        };
        let user = await userDao.getUserByKeyValue("mobile", saveData.mobile)
        user = JSON.parse(JSON.stringify(user))
        if (!user || !user.length) {
            res.locals.isExistingUser = true;
            const _newUser = await userDao.saveUnverifiedUser(saveData);
            user = saveData
        } else {
            user = user[0]
        }
        // const _userdata = JSON.parse(JSON.stringify(user));
        const userdata = user

        delete userdata.__v;
        delete userdata.password;
        res.user = userdata;
        res.ref = userdata
        res.ref.createOtp = true
        res.ref.type = "SMS_SIGNUP"
        next();


    } catch (error) {
        next(error);
    }
};
