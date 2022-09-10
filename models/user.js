const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserData = require("../schema/user");
const Site = require("./site");

class User {
    #id;
    #email;
    #emailVerified;
    #hashedPassword;
    #sites;
    #isAdmin;

    static #jwtSecret = process.env.JWT_SECRET;

    /**
     * Hashes provided password and saves new account data in the database
     * @param {string} email Unique email address for the new account
     * @param {string} plainPassword Password in plain text
     * @returns Object containing status code and a message
     */
    static async create(email, plainPassword) {
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
     * Verifies given credentials against data stored in the database and returns authentication token for the client if successful
     * @param {string} email Email address associated with an account
     * @param {string} plainPassword Plain text password
     * @returns JSON Web Token on success or an object containing status code and a message if an error occurs
     */
    static async verify(email, plainPassword) {
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
    async read() {
        const userData = await UserData.findById(this.#id);
        this.#email = userData.email;
        this.#emailVerified = userData.emailVerified;
        this.#hashedPassword = userData.hashedPassword;
        this.#sites = userData.sites;
        this.#isAdmin = userData.isAdmin;
    }

    /**
     * Updates account details in the database based on currect state of the object
     */
    async update() {
        for (const property in this) {
            if (property.startsWith('#') && property !== '#id') {
                await this.updateProperty(property.substring(1), this[property]);
            }
        }
    }

    /**
     * Updates given property of the object in the database
     */
    async updateProperty(property, value) {
        const userData = await UserData.findById(this.#id);
        userData[property] = value;
        await userData.save();
    }
    
    /**
     * Deletes the account from the database
     */
    async delete() {
        try {
            await this.read();
            await UserData.findByIdAndDelete(this.#id);
            
            // Delete all sites associated with the account
            for (const siteId of this.#sites) {
                const site = new Site(siteId);
                await site.delete();
            }

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
    
    /**
     * Creates a new site and adds it to the list of sites associated with the account
     * @returns Id of the newly created site
     */
    async createSite() {
        const site = await Site.create(this.#id);
        await this.read();
        this.#sites.push(site.id);
        await this.updateProperty('sites', this.#sites);
        return site.id;
    }

    /**
     * Deletes a user's site and removes it from the list of sites associated with the account
     * @param {string} siteId Id of the site to be deleted
     */
    async deleteSite(siteId) {
        await this.read();
        if (this.#sites.includes(siteId)) {
            const site = new Site(siteId);
            await site.delete();
            this.#sites = this.#sites.filter(id => id != siteId);
            await this.updateProperty('sites', this.#sites);
        }
    }

    /**
     * Creates a page in a user's site
     */
    async createPage(siteId) {
        if (this.#sites.includes(siteId)) {
            const site = new Site(siteId);
            await site.createPage();
        }
    }

    /**
     * Deletes a page from a user's site
     * @param {string} siteId Id of the site which page is to be deleted
     * @param {*} pageId Id of the page to be deleted
     */
    async deletePage(siteId, pageId) {
        await this.read();
        if (this.#sites.includes(siteId)) {
            const site = new Site(siteId);
            await site.deletePage(pageId);
        }
    }

    get id() { return this.#id; }
    get email() { return this.#email; }
    get emailVerified() { return this.#emailVerified; }
    get hashedPassword() { return this.#hashedPassword; }
    get sites() { return this.#sites; }
    get isAdmin() { return this.#isAdmin; }
    

    set email(email) { this.#email = email; }
    set emailVerified(emailVerified) { this.#emailVerified = emailVerified; }
    set hashedPassword(hashedPassword) { this.#hashedPassword = hashedPassword; }
    set sites(sites) { this.#sites = sites; }
    set isAdmin(isAdmin) { this.#isAdmin = isAdmin; }
}

module.exports = User;