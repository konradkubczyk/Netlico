const mongoose = require('mongoose');

class Database {
    static #uri = process.env.MONGODB_URI;

    static async connect() {
        try {
            console.log('Connecting to MongoDB...')
            await mongoose.connect(
                process.env.MONGODB_URI
            );
            console.log('Successfully connected to MongoDB.');
        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = Database;