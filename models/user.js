class User {
    #id;
    #email;
    #hashedPassword;
    #websites;
    #isAdmin;

    constructor(id = null, email = { address: null, isVerified: false }, isVerified = false, hashedPassword = null, websites = [], isAdmin = false) {
        this.#id = id;
        this.#email = email;
        this.#hashedPassword = hashedPassword;
        this.#websites = websites;
        this.#isAdmin = isAdmin;
    }

    #loadUser() {
        // TODO: Implement #loadUser() method
    }

    static createUser(email, password) {
        // TODO: Implement User.createUser
    }

    get username() {
        // TODO: Implement username() getter
    }
}

module.exports = User;