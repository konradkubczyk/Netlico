const jwt = require("jsonwebtoken");

class Auth {
    static #jwtSecret = process.env.JWT_SECRET;

    /**
     * Deserializes given authentication token
     * @param {string} authToken Authentication JSON Web Token
     * @returns Deserialized object containing user details when they are logged in or null otherwise
     */
    static #deserializeUser(authToken) {
        try {
            return jwt.verify(authToken, this.#jwtSecret);
        } catch (error) {
            return null;
        }
    }

    /**
     * Checks whether token bearer is authenticated
     * @param {string} authToken Authentication JSON Web Token
     * @returns Boolean value - true if logged in, false otherwise
     */
    static isLoggedIn(authToken) {
        return Boolean(this.#deserializeUser(authToken));
    }

    /**
     * Provides middleware which checks if user is logged in then adds their data to the request when available and if the state does not match the one which is expected, performs a redirection.
     * @param {boolean} [expectLoggedIn] Expected log in state
     * @param {string} [unauthorizedRedirect] Redirection path used in case of state mismatch
     * @returns Middleware
     */
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