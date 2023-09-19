module.exports = (fan) => {
    return (req, res, next) => { fan(req, res, next).catch(error => next(error)) }
}