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

    static isLoggedIn(authToken) {
        return Boolean(this.#deserializeUser(authToken));
    }

    static isAuthorized(expectLoggedIn = true, unauthorizedRedirect = '/account/login') {
        return (req, res, next) => {
            const user = this.#deserializeUser(req.cookies.authToken);

            if (expectLoggedIn === Boolean(user)) {
                req.user = user;
                next();
            } else {
                res.redirect(unauthorizedRedirect);
            }
        }
    }
}

module.exports = Auth;