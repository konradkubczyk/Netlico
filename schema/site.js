const mongoose = require('mongoose');

const SiteSchema = new mongoose.Schema({
    owners: {
        type: [mongoose.Schema.Types.ObjectId],
        required: [
            true,
            'Website needs to have at least one owner'
        ]
    },
    tier: {
        type: String,
        default: 'Free'
    },
    language: {
        type: String,
        default: 'en'
    },
    title: {
        type: String
    },
    description: {
        type: String
    },
    theme: {
        type: Number,
        default: 1,
    },
    subdomain: {
        type: String,
        unique: true
    },
    isPublished: {
        type: Boolean,
        default: false,
        required: [
            true,
            'Publication state is required'
        ]
    },
    customDomain: {
        type: String,
        unique: true
    },
    pages: {
        type: [mongoose.Schema.Types.ObjectId],
        required: [
            true,
            'Website needs to have at least one page'
        ]
    },
});

module.exports = mongoose.model.Sites || mongoose.model("Sites", SiteSchema);