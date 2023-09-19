const { ValidationError } = require("../../utils/handler/error");
const userDao = require('../../utils/mongodb/dao/user.dao')

module.exports.run = async (req, res, next) => {
    try {
        if (req.body.email || req.body.mobile) {
            const saveData = {
                name: req.body.name,
                email: req.body.email,
                mobile: req.body.mobile,
                password: req.body.password,
                createdOn: new Date(),
                modifiedOn: new Date(),
            };
            const newuser = await userDao.saveUser(saveData);
            const userdata = JSON.parse(JSON.stringify(newuser));
            delete userdata.__v;
            delete userdata.password;
            res.user = userdata;
            res.locals.rootData = userdata;
            next();
        } else {
            throw new ValidationError("Atleast one field required; email or mobile")
        }

    } catch (error) {
        next(error);
    }
};
