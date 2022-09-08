const mongoose = require('mongoose');

const PageSchema = new mongoose.Schema({
    site: {
        type: mongoose.Schema.Types.ObjectId
    },
    title: {
        type: String,
        default: 'New page'
    },
    position: {
        type: Number
    },
    content: {
        type: String,
        default: 'This is a new page, let\'s add some content!'
    },
    path: {
        type: String
    }
});

module.exports = mongoose.model.Pages || mongoose.model("Pages", PageSchema);