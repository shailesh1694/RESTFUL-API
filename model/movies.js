const mongoose = require("mongoose")
const fs = require("fs")

const moivesScheme = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is Required !"],
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        required: [true, "description is Required !"],
        trim: true
    },
    duration: {
        type: Number,
        required: [true, "duration is Required !"],
    },
    reting: {
        type: Number,
        required: [true, "reting is Required !"],
        validate: {
            validator: function (value) {
                return value >= 1 && value <= 10
            },
        },
        message: "Rating Shoud Be above 1 and  below 10"
    },
    totalRating: {
        type: Number,
        required: [true, "totalRating is Required !"]

    },
    realeaseYear: {
        type: Date,
        required: [true, "realeaseYear is Required !"]
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    genres: {
        type: [String],
        required: [true, "Genres is required !"]
    },
    director: {
        type: [String],
        required: [true, "director is required !"]
    },
    actor: {
        type: [String],
        required: [true, "actor is required !"]
    }, price: {
        type: Number,
        required: [true, "price is required !"]
    },
    addBy: String

}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

moivesScheme.virtual("durationInHour").get(function () {
    return this.duration / 60
})

//pre save hooks

moivesScheme.pre("save", function (next) {
    this.addBy = "shaileshMori"  //here method call before documentsave
    next()
})

moivesScheme.post("save", function (doc, next) {
    const content = `A new  document created by ${doc.addBy} `
    fs.writeFileSync("./log/log.txt", content, { flag: "a" }, (err) => {
        console.log(err.message)
    })
    next()
})


// moivesScheme.pre(/^find/, function (next) {
//     this.find({ realeaseYear: { $lte: new Date().getFullYear() } })
//     this.startTime = Date.now()
//     next()
// })

// moivesScheme.post(/^find/, function (doc, next) {

//     this.find({ realeaseYear: { $lte: new Date().getFullYear() } })
//     this.endTime = Date.now()
//     const content = `\n Query Time ${this.endTime - this.startTime}`

//     fs.writeFileSync("./log/log.txt", content, { flag: "a" }, (err) => {
//         console.log(err.message)
//     })
//     next()
// })

moivesScheme.pre("aggregate", function (next) {
    this.pipeline().unshift({ $match: { realeaseYear: { $lte: new Date().getFullYear() } } })
    next()
})
module.exports = mongoose.model("Movies", moivesScheme)