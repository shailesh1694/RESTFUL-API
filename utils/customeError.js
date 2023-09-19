class CustomeError extends Error {
    constructor(message, statusCode) {
        super(message)
        console.log(message, statusCode)
        this.statusCode = statusCode
        this.message = message
    }
}

module.exports = { CustomeError }