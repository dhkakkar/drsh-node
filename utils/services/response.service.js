const unSuccessResponse = (error, req, res) => {
  if (req.file) {
    const { deleteFile } = require("./fileOperation");
    deleteFile(req.file.key);
  }
  error.statusCode = error.statusCode || 500;
  let response = {
    success: false,
    statusCode : error.statusCode,
    displayMessage:
      error.displayMessage || "Sorry! we could not process your request now",
    err_type: error.name,
    message: error.message,
    description: error.description || "ERR-3333",
    errorObj: error.errObj || {},
  };
  if (response.errorObj == {}) {
    delete response.errorObj;
  }
  console.log(error)
  res.status(error.statusCode).send(response);
};

const successResponse = (req, res) => {
  let msg = "Response generated successfully";
  if (!res.locals.rootData) {
    msg = "rootData not set";
    const err = new Error("rootData not set");
    unSuccessResponse(err, req, res);
    return;
  } else {
    if (res.locals.message) {
      msg = res.locals.message;
    }
  }
  const response = {
    success: true,
    statusCode : 200,
    displayMessage: res.locals.displayMessage || "",
    message: msg,
    description: "GRS-0000",
    resultObj: res.locals.rootData || {},
  };

  res.send(response);
};

module.exports = {
  unSuccessResponse,
  successResponse,
};
