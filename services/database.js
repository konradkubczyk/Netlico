const mongoose = require('mongoose');

async function connect() {
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

module.exports = { connect };