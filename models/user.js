class User {
    #id;
    #email;
    #emailVerified;
    #hashedPassword;
    #websites;
    #admin;

    constructor(id = null, email = null, isVerified = false, hashedPassword = null, websites = [], admin = false) {
        this.#id = id;
        this.#email = email;
        this.#emailVerified = isVerified;
        this.#hashedPassword = hashedPassword;
        this.#websites = websites;
        this.#admin = admin;
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