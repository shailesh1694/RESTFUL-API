const express = require("express")
process.on("uncaughtException", (error) => {
    process.exit(1)
})
const app = express()
const conncetDB = require("./config/db")
const morgan = require('morgan')
const errorhandle = require("./controller/errorhandle")
const { CustomeError } = require("./utils/customeError")

conncetDB()
app.use(express.json())
app.use(morgan("dev"))
app.use("/", require("./routes/movieRoute"))
app.use("/test", require("./routes/userRoute"))

app.all("*", (req, res, next) => {
    const err = new CustomeError("Can not fount " + " " + req.originalUrl, 404)
    next(err)
})

app.use(errorhandle)   //globalerror

const server = app.listen(3001, () => {
    console.log("ListenData")
})

process.on("unhandledRejection", (error) => {
    server.close(() => {
        process.exit(1)
    })
})

