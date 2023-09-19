const uuid = require('uuid');
const walletDao = require('../../utils/mongodb/dao/wallet.dao')
const httpRequest = require('../../utils/handler/request/http')
const appConfig = require('../../config/appConfig.json')
module.exports.run = async (req, res, next) => {
    try {
        const user = req.user;
        const userId = user._id
        const _walletData = await walletDao.getWalletByKeyValue("user", userId)
        const walletData = _walletData[0]
        const externalUserID = walletData.externalUserID;
        const walletInfo = await httpRequest("wallet_getByExternalID", null, { params: { externalUserID } })
        res.locals.rootData = {
            userId:user._id,
            balance: walletInfo.wallet.balance,
            redirectUrl : `${appConfig.paymentUrl}/${walletInfo.externalUserID}`
        };
        next()


    } catch (error) {
        next(error)
    }
}