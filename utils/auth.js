const jwt = require("jsonwebtoken");

module.exports = {
    loggedIn: (req, res, next) => {
        try {
            const token = req.cookies.auth_token;
            req.user = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
            next();
        } catch (error) {
            // res.status(401).json({
            //     message: 'Unauthorized, log in to access the resource',
            //     error: new Error("Invalid request")
            // });
            res.status(401).redirect('/account/login');
        }
    },
    loggedOut: (req, res, next) => {
        try {
            const token = req.cookies.auth_token;
            req.user = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
            res.redirect('/');
        } catch (error) {
            next();
        }
    }
}