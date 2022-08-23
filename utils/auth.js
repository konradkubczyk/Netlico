const jwt = require("jsonwebtoken");

class Auth {
    static #jwtSecret = process.env.JWT_SECRET;

    static #deserializeUser(authToken) {
        try {
            return jwt.verify(authToken, this.#jwtSecret);
        } catch (error) {
            return null;
        }
    }

    static isAuthorized(expectLoggedIn = true, unauthorizedRedirect = '/account/login') {
        return (req, res, next) => {
            req.user = this.#deserializeUser(req.cookies.authToken);

            if (expectLoggedIn === Boolean(req.user)) {
                next();
            } else {
                res.redirect(unauthorizedRedirect);
            }
        }
    }
}

module.exports = Auth;