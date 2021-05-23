const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    profileImg: {
        type: String
    },
    title: {
        type: String
    },
    name: {
        type: String
    },
    description: {
        type: String
    },
    status: {
        type: String
    }
}, {
    collection: 'applicants'
})

module.exports = mongoose.model('Applicants', userSchema)