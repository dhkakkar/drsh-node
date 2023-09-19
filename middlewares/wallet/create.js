const uuid = require('uuid');
const walletDao = require('../../utils/mongodb/dao/wallet.dao')
const httpRequest = require('../../utils/handler/request/http')
module.exports.run = async (req, res, next) => {
    try {
        if(res.locals.isExistingUser){
            return next()
        }
        const user = req.user || res.user;
        const externalUserID = uuid.v4()
        const timestamp = Date.now()
        const nameArr = user.name.split(" ")
        
        const data = {
            externalUserID
        }
        if(nameArr.length > 1){
            const _firstName = [...nameArr]
            _firstName.pop()
            data.firstName = _firstName.join(" ")
            data.lastName = nameArr[nameArr.length-1]
        }
        data.email = user.email ? user.email : `noemail_${timestamp}@email.com`
        data.phoneNumber = user.mobile ? user.mobile : `nomobile_${timestamp}`
        const extWallet = await httpRequest("wallet_create", data);
        if(extWallet){
            const localWalletRecordData={
                user:user._id,
                platformUserId:extWallet.user.id,
                walletId:extWallet.id,
                firstName:extWallet.user.firstName,
                lastName:extWallet.user.lastName,
                email:extWallet.user.email,
                phoneNumber:extWallet.user.phoneNumber,
                externalUserID:extWallet.user.externalUserID,
                createdOn:extWallet.dateCreated,
                modifiedOn:extWallet.dateUpdated,

            }

            const saveWallet = walletDao.saveWallet(localWalletRecordData)
            next()
        }


    } catch (error) {
        next(error)
    }
}