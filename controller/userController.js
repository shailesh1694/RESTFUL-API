const UserModel = require("../model/userModel")
const asyncErrorhandler = require("../utils/asyncErrorhandler")
const { CustomeError } = require("../utils/customeError")
const jwt = require("jsonwebtoken")
const sendEmail = require("../utils/sendEmail")
const crypto = require("crypto")
const userModel = require("../model/userModel")

const signjwt = (id) => {
    return jwt.sign({ id }, "shailesh-mittal-16101994-30061998", { expiresIn: "2h" })
}
const sinUpuserController = asyncErrorhandler(async (req, res, next) => {

    if (!req.body.email || !req.body.password) {
        const error = new CustomeError("Enter email or password", 422)
        return next(error)
    }
    const user = await UserModel.create(req.body)
    res.status(201).json({
        success: true,
        msg: "User Register successful"
    })
})


const loginController = asyncErrorhandler(async (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) {
        const error = new CustomeError("Enter email or password", 422)
        return next(error)
    }
    const user = await UserModel.findOne({ email }).select("+password")

    if (!user || !(await user.comparePassword(password, user.password))) {
        const error = new CustomeError("incorrent Email or Password", 404)
        return next(error)
    }

    res.status(200).json({ success: true, msg: "login", token: signjwt(user._id) })

})

const forgotePassword = asyncErrorhandler(async (req, res, next) => {
    // console.log(req.body)

    const email = req.body.email;
    const user = await UserModel.findOne({ email })
    if (!user) {
        return next(new CustomeError("User Not found With this Email !", 404))
    }
    let resettoken = await user.forgotpassword()
    const data = await user.save({ validateBeforeSave: false })
    // console.log(data)
    // console.log(resettoken, "findByemail")
    const resetUrl = `${req.protocol}://${req.get("host")}/test/Password/${resettoken}`
    const message = `we have received password reset requiest, in below link and reset your password link is ${resetUrl}`
    // console.log(resetUrl, "reseturl")
    // console.log(message, "message")

    let doinCatch = () => {
        return async () => {
            user.passwordResetToken = undefined;
            user.passwordResetTokenExpire = undefined;
            await user.save({ validateBeforeSave: false })

            return next(new CustomeError("server Error try after some timesF", 500))
        }
    }

    await sendEmail({
        email: user.email,
        subject: "password Change Request Received !",
        message: message
    }, doinCatch)

    res.status(201).json({
        success: true,
        msg: "password Reset Link Send register Email "
    })

})



const resetPassword = asyncErrorhandler(async (req, res, next) => {
    const token = crypto.createHash("sha256").update(req.params.token).digest("hex")
    const user = await userModel.findOne({ passwordResetToken: token, passwordResetTokenExpire: { $gt: Date.now() } })
    console.log(user)
    if (!user) {
        return next(new CustomeError("password Reset Token has been expire please try again !", 400))
    }
    user.password = req.body.password;
    user.cpassword = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpire = undefined;
    user.passwordChangeAt = Date.now()
    await user.save()
    res.status(200).json({
        success: true,
        msg: "password Reset Successfull",
        token: signjwt(user._id)
    })
})
module.exports = { sinUpuserController, loginController, forgotePassword, resetPassword }