const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require('bcrypt')
const crypto = require("crypto")
const { restart } = require("nodemon")


const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "Name is required Field !"]
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: [true, "Name is required Field !"],
        validate: [validator.isEmail, "Enter Valid Email !"]
    },
    password: {
        type: String,
        required: [true, "password is required Field !"],
        minlenght: 5,
        select: false
    },
    cpassword: {
        type: String,
        required: [true, "password is required Field !"],
        validate: {
            validator: function (value) {
                return this.password === value
            },
            message: "Password and confirm password are not match !"
        }
    },
    role: {
        type: String,
        require: [true, "User Role is Required Field !"],
        enum: ["user", "admin", "test"],
        default: "user"
    },
    passwordResetToken: {
        type: String,
    },
    passwordResetTokenExpire: {
        type: Date,
    },
    passwordChangeAt: {
        type: Date,
        default: Date.now()
    }
})

userSchema.pre("save", async function (next) {
    if (!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 8)
    this.cpassword = undefined
    next()
})

userSchema.methods.comparePassword = async function (pass, passDB) {
    return await bcrypt.compare(pass, passDB)
}

userSchema.methods.forgotpassword = async function () {
    const resetToken = crypto.randomBytes(32).toString("hex")

    this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex")
    this.passwordResetTokenExpire = Date.now() + 10 * 60 * 1000

    console.log(this.passwordResetToken, resetToken)

    return resetToken
}

module.exports = mongoose.model("UserModel", userSchema)