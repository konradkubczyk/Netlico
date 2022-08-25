const mongoose = require('mongoose');

const PageSchema = new mongoose.Schema({
    website: {
        type: ObjectId
    },
    title: {
        type: String
    },
    position: {
        type: Number
    },
    content: {
        type: String
    },
    permalink: {
        type: String
    }
});

module.exports = mongoose.model.Pages || mongoose.model("Pages", PageSchema);