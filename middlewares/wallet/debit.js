const uuid = require('uuid');
const walletDao = require('../../utils/mongodb/dao/wallet.dao')
const httpRequest = require('../../utils/handler/request/http')
const appConfig = require('../../config/appConfig.json')
module.exports.run = async (req, res, next) => {
    try {
        if(!res.locals.wallet){
            throw new Error("Wallet details should be mention in previous middleware")
        }
        const data = {
            amount : res.locals.wallet.amount,
            reason:res.locals.wallet.reason
        }

        const userId = res.locals.wallet.userId
        const _walletData = await walletDao.getWalletByKeyValue("user", userId)
        const walletData = _walletData[0]
        const externalUserID = walletData.externalUserID;
        const walletInfo = await httpRequest("wallet_debit", data, { params: { externalUserID } })
        next()


    } catch (error) {
        next(error)
    }
}