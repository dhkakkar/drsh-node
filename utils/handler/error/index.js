const BaseError = require('./baseError')
class ValidationError extends BaseError {
    constructor(
        message,
        errObj = {},
        name = "ValidationError",
        displayMessage = "Request validation failed",
        statusCode = 400,
        description = 'MT-5001',
    ) {
        super(message, errObj, name, displayMessage, statusCode, description)

        if (this.message == "") {
            this.message = "Validation Failed"
        }
        this.errObj = errObj;
    }
}

class MongoError extends BaseError {
    constructor(
        message,
        errObj = {},
        name = "MongoError",
        displayMessage = "Request failed from MongoDB",
        statusCode = 500,
        description = 'MT-5002',
    ) {
        super(message, errObj, name, displayMessage, statusCode, description)
    }
}
class FileUploadError extends BaseError {
    constructor(
        message,
        errObj = {},
        name = "FileUploadError",
        displayMessage = "Error in uploading file",
        statusCode = 400,
        description = 'MT-5003',
    ) {
        super(message, errObj, name, displayMessage, statusCode, description)
    }
}


class UnauthorizedError extends BaseError {
    constructor(
        message,
        errObj = {},
        name = "Unauthorized",
        displayMessage = "Access Denied",
        statusCode = 401,
        description = 'MT-5004',
    ) {
        super(message, errObj, name, displayMessage, statusCode, description)
    }
}

class NoRecordFoundError extends BaseError {
    constructor(
        message,
        errObj = {},
        name = "NoRecordDound",
        displayMessage = "No record found",
        statusCode = 200,
        description = 'MT-5005',
    ) {
        super(message, errObj, name, displayMessage, statusCode, description)
    }
}
class NoFileSelectedError extends BaseError {
    constructor(
        message,
        errObj = {},
        name = "NoFileSelected",
        displayMessage = "No file selected",
        statusCode = 400,
        description = 'MT-5006',
    ) {
        super(message, errObj, name, displayMessage, statusCode, description)
    }
}
class InvalidRequestError extends BaseError {
    constructor(
        message,
        errObj = {},
        name = "InvalidRequest",
        displayMessage,
        statusCode = 500,
        description = 'MT-5007',
    ) {
        super(message, errObj, name, displayMessage, statusCode, description)
    }
}

class BadRequestError extends BaseError {
    constructor(
        message,
        errObj = {},
        name = "BadRequest",
        displayMessage = "400 Bad request",
        statusCode = 400,
        description = 'MT-5008',
    ) {
        super(message, errObj, name, displayMessage, statusCode, description)

        if (this.message == "") {
            this.message = "Bad Request"
        }
        this.errObj = errObj;
    }
}


module.exports = { 
    ValidationError, 
    MongoError, 
    FileUploadError, 
    UnauthorizedError, 
    NoRecordFoundError, 
    NoFileSelectedError,
    InvalidRequestError,
    BadRequestError
}