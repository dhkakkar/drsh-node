const { ValidationError } = require('../../utils/handler/error')
module.exports.run = (req, res, next) => {
    try {
        let from = 0;
        let to = 9;
        if (req.query) {
            if (req.query.from) {
                req.query.from = parseInt(req.query.from);
                if (req.query.from !== NaN) {
                    from = req.query.from;
                    to = from + 9; //if no to in query param, to will automatically set to 10+.
                } else {
                    throw new ValidationError("from should be a single digit number");
                }

            }
            if (req.query.to) {
                req.query.to = parseInt(req.query.to);
                if (req.query.to !== NaN) {
                    to = req.query.to;
                } else {
                    throw new ValidationError("to should be a single digit number");
                }

            }

            if (from > to || from == to) {
                throw new ValidationError("Invalid pagination range. to should be greater than from");
            }
        }
        if (from < 0 || to < 0) {
            throw new ValidationError("from should be 0 or greater than 0 and to should be greater than 0")
        }
        delete req.query.from;
        delete req.query.to;
        req.query.pagination = {
            skip: from,
            limit: to - from
        }
        
        next()
    } catch (error) {
        next(error);
    }
}