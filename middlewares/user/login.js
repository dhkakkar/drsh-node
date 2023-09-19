const { loginUser, getUserByKeyValue } = require('../../utils/mongodb/dao/user.dao');
const { compareText } = require('../../utils/services/bcryptText');
const { containsOnlyNumbers } = require('../../utils/helper/stringFunc')
const { UnauthorizedError } = require('../../utils/handler/error');

module.exports.run = async (req, res, next) => {
  try {
    let result;
    const incommingData = req.body;

    if (containsOnlyNumbers(incommingData.username)) {
      result = await getUserByKeyValue('mobile', incommingData.username);
    } else {
      result = await getUserByKeyValue('email', incommingData.username);
    }

    if (result.length == 0) {
      throw new UnauthorizedError('Username does not exist');
    }
    if (!result[0].isVerified) {
      throw new UnauthorizedError('User is not verified', {
        email: result.email,
        isVerified: false
      });
    }
    const user = { ...result[0] };
    const isCompared = await compareText(incommingData.password, user.password);
    if (isCompared) {
      res.locals.rootData = user;
      delete user.password;
      delete user.__v;
      res.locals.rootData = user;
      res.user = user;
      next();
    } else {
      throw new UnauthorizedError('Wrong Password');
    }
  } catch (err) {
    next(err);
  }
};
