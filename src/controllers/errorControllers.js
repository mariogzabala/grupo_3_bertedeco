let errorController = {
    notfound: function(req, res, next) {
        res.status(404)
        res.render('error')
    }

}

module.exports = errorController