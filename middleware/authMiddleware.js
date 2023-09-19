const asyncErrorhandler = require("../utils/asyncErrorhandler")
const jwt = require("jsonwebtoken")
const UserModel = require("../model/userModel")
const { CustomeError } = require("../utils/customeError")
const util = require("util")

const authMiddleware = asyncErrorhandler(async (req, res, next) => {

    const bearer = req.headers.authorization.split(" ")[1]
    if (!req.headers.authorization) {
        const error = new CustomeError("You are not LogIn !", 401)
        return next(error)
    }
    const decode = await util.promisify(jwt.verify)(bearer, "shailesh-mittal-16101994-30061998")

    const findUser = await UserModel.find({ _id: decode.id }).select("-emailf")
    if (!findUser.length === 0 || !decode) {
        return next(new CustomeError("User Not found!", 404))
    }
    req.user = findUser
    next()
})

const userRolevarify = (...role) => {
    return (req, res, next) => {
        if (!role.includes(req.user.role)) {
            return next(new CustomeError("Your are not allowed to take this action", 403))
        }
        next()
    }
}


module.exports = { authMiddleware, userRolevarify } 