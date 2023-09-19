const MoviesModel = require("../model/movies")
const asyncErrorhandler = require("../utils/asyncErrorhandler")
const { CustomeError } = require("../utils/customeError")


const addMoviesCollection = asyncErrorhandler(async (req, res) => {
    const data = await MoviesModel.create(req.body)
    res.status(201).json({ success: true, data: data, msg: "Add Movies success" })
})

const filterMovies = asyncErrorhandler(async (req, res) => {
    const moviesData = await MoviesModel.aggregate([
        { $match: { reting: { $gte: 0.5 } } },
        {
            $group: {
                //             // _id: null,
                //             // avgRating: { $avg: "$reting" },
                //             // avgPrice: { $avg: "$price" },
                //             // minPrice: { $min: "$price" },
                //             // maxPrice: { $max: "$price" },
                //             // totalPrice: { $sum: "$price" },
                //             // movieCount: { $sum: 1 }

                _id: "$realeaseYear",
                avgRating: { $avg: "$reting" },
                avgPrice: { $avg: "$price" },
                minPrice: { $min: "$price" },
                maxPrice: { $max: "$price" },
                totalPrice: { $sum: "$price" },
                movieCount: { $sum: 1 }

            }
        }
    ])
    // const moviesData = await MoviesModel.aggregate([
    //     { $unwind: "$genres" },
    //     {
    //         $group: {
    //             _id: "$genres",
    //             Moviescount: { $sum: 1 },
    //             Movie: { $push: "$name" }
    //         }
    //     },
    //     { $addFields: { genres: "$_id" } },
    //     { $project: { _id: 0 } },
    //     { $sort: { Moviescount: 1 } },
    //     // { $limit: 5}
    //     { $match: { genres: req.query.genres } }
    // ])
    res.status(200).json({ data: moviesData, total: moviesData.length, msg: "Movies List Fetch" })
})

const allMoviesList = asyncErrorhandler(async (req, res) => {
    const MovieData = await MoviesModel.find()
    res.status(200).json({ data: MovieData, msg: "All Movies List !" })

})

const updateMoviespatch = asyncErrorhandler(async (req, res) => {
    const data = await MoviesModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    res.status(201).send({ success: true, data: data, msg: "updata" })
})

const movieByid = asyncErrorhandler(async (req, res, next) => {
    let movies = await MoviesModel.findById(req.params.id)
    if (!movies) {
        const error = new CustomeError("With This Id movie not found !", 404)
        return next(error)
    }
    res.status(200).json({
        data: movies,
        success: true,
        msg: "Movies fetch successfull"
    })
})

const deleteMovie = asyncErrorhandler(async (req, res, next) => {
    const id = req.params.id
    const del = await MoviesModel.findByIdAndDelete(id)
    res.status(200).json({
        success: true,
        data: del,
        msg: "record remove successfull"
    })
})

module.exports = { addMoviesCollection, filterMovies, allMoviesList, updateMoviespatch, movieByid, deleteMovie }