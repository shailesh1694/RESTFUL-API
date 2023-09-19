const express = require("express")
const router = express.Router()
const UserModel = require("../model/userModel")
const { sinUpuserController, loginController, forgotePassword,resetPassword } = require("../controller/userController")

router.post("/registerUser", sinUpuserController)
router.post("/login", loginController)
router.post("/forgotPassword", forgotePassword)
router.patch("/Password/:token",resetPassword )


module.exports = router;