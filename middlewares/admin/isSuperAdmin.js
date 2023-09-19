const { UnauthorizedError } = require("../../utils/handler/error")

module.exports.run = (req, res, next)=>{
    try {
        const user = req.user
        if(user.type == "SUPERADMIN"){
            next()
        }else{
            throw new UnauthorizedError("Access privilege to super admin only")
        }
    } catch (error) {
        next(error)
    }
}