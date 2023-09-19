const { ValidationError } = require("../../utils/handler/error");
const userDao = require('../../utils/mongodb/dao/user.dao')

module.exports.run = async (req, res, next) => {
    try {
        if(req.params.loginType != "GOOGLE"){
            next();
            return;
        }
        if (req.body.email || req.body.mobile) {
            const saveData = {
                googleIdToken:req.body.idToken,
                googleId:req.body.id,
                name: req.body.name,
                email: req.body.email,
                loginType:["GOOGLE"],
                profileImage: req.body.photoUrl,
                createdOn: new Date(),
                modifiedOn: new Date(),
                isVerified:true
            };
            let user
            const existingUser = await userDao.getUserByKeyValue("email", req.body.email)
            if(existingUser.length){
                userDao.updateUserByCondition({email:req.body.email}, saveData)
                user = existingUser[0]
                res.locals.isExistingUser = true;
            }else{
                user = await userDao.saveUser(saveData);
            }
            
            const userdata = JSON.parse(JSON.stringify(user));
            delete userdata.__v;
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
