const mongoose = require('mongoose');

class Database {
    static #uri = process.env.MONGODB_URI;

    /**
     * Attempts to connect with MongoDB using MONGODB_URI environment variable
     */
    static async connect() {
        try {
            console.log('Connecting to MongoDB...')
            await mongoose.connect(
                this.#uri
            );
            console.log('Successfully connected to MongoDB.');
        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = Database;