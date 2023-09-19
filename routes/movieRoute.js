const express = require("express")
const router = express.Router()
const MoviesModel = require("../model/movies")
const { addMoviesCollection, filterMovies, allMoviesList, updateMoviespatch, movieByid, deleteMovie } = require("../controller/addMoviesController")
const { authMiddleware, userRolevarify } = require("../middleware/authMiddleware")

// router.get("/movies", async (req, res) => {

//     let page = req.query.page * 1
//     let limite = req.query.limite * 1
//     let skip = (page - 1) * limite
//     try {
//         const moviesData = await MoviesModel.find()
//         // .skip(skip).limit(limite)
//         // .select("-Images")
//         // .limit(3)
//         // .sort({Year:1})
//         res.status(200).json({ data: moviesData, total: moviesData.length, msg: "Movies List Fetch" })
//     } catch (error) {
//         res.status(500).send("Internal Server Error")
//     }
// })

router.get("/movieList", authMiddleware, allMoviesList)
router.get("/movies/filter", filterMovies)
router.post("/movies/add", authMiddleware, userRolevarify("admin"), addMoviesCollection)
router.get("/movies/:id", movieByid)
router.delete("/movies/delete/:id", authMiddleware, userRolevarify("admin"), deleteMovie)

module.exports = router