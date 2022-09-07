const mongoose = require('mongoose');

const PageSchema = new mongoose.Schema({
    site: {
        type: mongoose.Schema.Types.ObjectId
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
    path: {
        type: String
    }
});

module.exports = mongoose.model.Pages || mongoose.model("Pages", PageSchema);