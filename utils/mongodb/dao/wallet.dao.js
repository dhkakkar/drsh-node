
const WalletModel = require('../models/wallet.model');
const { ObjectId } = require('mongoose').Types;

const saveWallet = async (data) => {
  try {
    walletData = new WalletModel(data);
    return walletData.save();
  } catch (error) {
    throw error;
  }
};

const getWalletByKeyValue = async (key, value) => {
    try {
      const query = {};
      if (key === '_id' || key === 'user' ) value = new ObjectId(value);
      query[key] = value;
      const user = await WalletModel.find(query).populate('user').exec();
      const output = JSON.parse(JSON.stringify(user));
      return output;
    } catch (error) {
      throw error;
    }
  };
  

module.exports={
    saveWallet,
    getWalletByKeyValue
}