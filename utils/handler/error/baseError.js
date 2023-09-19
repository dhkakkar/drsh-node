class BaseError extends Error {
    constructor(message, errObj, name, displayMessage, statusCode, description) {
        super(message)

        Object.setPrototypeOf(this, new.target.prototype)
        this.message = message
        this.name = name
        this.statusCode = statusCode
        this.errObj = errObj
        this.statusCode = statusCode
        this.description = description
        this.displayMessage = displayMessage
        Error.captureStackTrace(this)
    }
}

module.exports = BaseError