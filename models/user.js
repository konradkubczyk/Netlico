const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserData = require("../schema/user");

class User {
    #id;
    #email;
    #emailVerified;
    #hashedPassword;
    #websites;
    #isAdmin;

    static #jwtSecret = process.env.JWT_SECRET;

    /**
     * Hashes provided password and saves new account data in the database
     * @param {string} email Unique email address for the new account
     * @param {string} plainPassword Password in plain text
     * @returns Object containing status code and a message
     */
    static async register(email, plainPassword) {
        let user;

        try {
            const hashedPassword = await bcryptjs.hash(plainPassword, 10);
            user = new UserData({
                email: email,
                hashedPassword: hashedPassword
            });
        } catch (error) {
            throw {
                status: 500,
                message: 'Could not hash the password'
            };
        }

        try {
            await user.save();

            return {
                status: 201,
                message: 'Account created successfully'
            }

        } catch (error) {
            throw {
                status: 500,
                message: 'Email already in use'
            }
        }
    }

    /**
     * Checks given credentials against data stored in the database and returns authentication token for the client if successful
     * @param {string} email Email address associated with an account
     * @param {string} plainPassword Plain text password
     * @returns JSON Web Token on success or an object containing status code and a message if an error occurs
     */
    static async logIn(email, plainPassword) {
        let user;
        
        try {
            user = await UserData.findOne({
                email: email
            });

            if (!user) {
                throw new Error('Could not find an account associated with the provided email address');
            }
        } catch (error) {
            throw {
                status: 400,
                message: 'Account does not exist'
            }
        }

        const isPasswordCorrect = await bcryptjs.compare(plainPassword, user.hashedPassword);

        if (isPasswordCorrect) {
            const authToken = jwt.sign(
                {
                    id: user._id,
                    email: user.email
                },
                this.#jwtSecret,
                {
                    expiresIn: '24h'
                }
            );

            return authToken;
        } else {
            throw {
                status: 400,
                message: 'Incorrect password'
            }
        }
    }

    constructor(userId) {
        this.#id = userId;
    }

    /**
     * Loads all properties of the object from database based on its id
     */
    async loadData() {
        const userData = await UserData.findById(this.id);
        this.#email = userData.email;
        this.#emailVerified = userData.emailVerified;
        this.#hashedPassword = userData.hashedPassword;
        this.#websites = userData.websites;
        this.#isAdmin = userData.isAdmin;
    }
    
    async delete() {
        try {
            await UserData.findByIdAndRemove(this.id);
            return {
                status: 200,
                message: 'Account deleted successfully'
            }
        } catch (error) {
            throw {
                status: 500,
                message: 'Could not delete user data'
            }
        }
    }

    get id() {
        return this.#id;
    }

    get email() {
        if (typeof this.#email !== 'undefined') {
            return this.#email;
        }
        return (async () => {
            await this.loadData();
            return this.#email;
        })();
    }

    get hashedPassword() {
        if (typeof this.#hashedPassword !== 'undefined') {
            return this.#hashedPassword;
        }
        return (async () => {
            await this.loadData();
            return this.#hashedPassword;
        })();
    }

    get emailVerified() {
        if (typeof this.#emailVerified !== 'undefined') {
            return this.#emailVerified;
        }
        return (async () => {
            await this.loadData();
            return this.#emailVerified;
        })();
    }

    get websites() {
        if (typeof this.#websites !== 'undefined') {
            return this.#websites;
        }
        return (async () => {
            await this.loadData();
            return this.#websites;
        })();
    }

    get isAdmin() {
        if (typeof this.#isAdmin !== 'undefined') {
            return this.#isAdmin;
        }
        return (async () => {
            await this.loadData();
            return this.#isAdmin;
        })();
    }
}

module.exports = User;