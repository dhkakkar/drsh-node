const { validationResult } = require("express-validator");
const { ValidationError } = require("../handler/error");

module.exports.run = async (req, res, next) => {
  if (res.locals.config && res.locals.config.validator) {
    try {
      const schema = require("./" + res.locals.config.validator);
      delete res.locals.config;
      const validationArr = schema.get();

      for (let i = 0; i < validationArr.length; i++) {
        await validationArr[i].run(req);
      }
      const result = validationResult(req);

      if (!result.isEmpty()) {
        const mappedErrors = result.array();
        let errorArr = [];
        for (let i = 0; i < mappedErrors.length; i++) {
          let newErrObj = {
            param: mappedErrors[i].param,
            msg: mappedErrors[i].msg,
          };
          if (
            errorArr.filter((e) => e.param == mappedErrors[i].param).length == 0
          )
            errorArr.push(newErrObj);
        }
        const errObj = { errorList: errorArr };
        const errorDisplaymessage = errorArr.reduce(
          (acc, cur) => `${acc}${acc ? ", " : ""}${cur.msg}`,
          ""
        );
        throw new ValidationError(
          "",
          errObj,
          "Validation Error",
          errorDisplaymessage
        );
      } else {
        next();
      }
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
};
