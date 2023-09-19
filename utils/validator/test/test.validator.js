const { check } = require("express-validator");


module.exports.get = () => {
  return [
    check("productName")
      .exists()
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please enter product name"),
    check("description")
      .exists()
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please enter productDescription"),
  ];
};
