const { CustomeError } = require("../utils/customeError")

const develop = (error, res) => {
    res.status(error.statusCode || 500).json({
        success: false,
        msg: error.message,
        error: error,
        stack: error.stack
    })
}


const prod = (error, res) => {
    res.status(error.statusCode || 500).json({
        success: false,
        msg: error.message,
    })
}

const custome = (err) => {
    return new CustomeError(`Error in ${err.path} and value ${err.value}`, 400)
}

const duplicatekey = (err) => {
    const msg = `with that ${err.keyValue.name} already exist !`
    return new CustomeError(msg, 404)
}

const validationError = (err) => {
    const errors = Object.values(err.errors).map(ele => ele.message)
    let msg = errors.join(",")
    return new CustomeError(`Invalid Input :${msg}`, 400)
}
const jsonExpireError = (err) => {
    return new CustomeError("Token has Expires", 401)
}
const jsonWebError = (err) => {
    return new CustomeError("invalid Token login Again", 401)
}
module.exports = (error, req, res, next) => {

    if (process.env.NODE_ENV === 'development') {
        develop(error, res)
    } else {
        if (error.name === "CastError") {
            const err1 = custome(error)
            return prod(err1, res)
        } else if (error.code === 11000) {
            const err2 = duplicatekey(error)
            return prod(err2, res)
        } else if (error.name === 'ValidationError') {
            const err3 = validationError(error)
            return prod(err3, res)
        } else if (error.name === "TokenExpiredError") {
            const err4 = jsonExpireError(error)
            return prod(err4, res)
        } else if (error.name === "jsonWebTokenError") {
            const err5 = jsonWebError(error)
            return prod(err5, res)
        }
        prod(error, res)
    }
}