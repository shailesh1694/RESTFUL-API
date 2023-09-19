const mongoose = require("mongoose")
const MoviesModel = require("../model/movies")
const connectDb = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/RestAPI")
            .then((res) => { console.log(`connected at ${mongoose.connection.host}`) })
            // .catch((error) => { console.log("Not connected") })
    } catch (error) {
        console.log(error, "IN DataBase Error")
    }

}
const importMovies = async () => {
    try {
        await MoviesModel.deleteMany()
        console.log("first")
    } catch (error) {

    }
}
// importMovies()
module.exports = connectDb;

