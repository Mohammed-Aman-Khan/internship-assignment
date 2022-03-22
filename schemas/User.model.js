const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    name: String,
    buddies: [ mongoose.Types.ObjectId ],
    giftBoxes: [ mongoose.Types.ObjectId ],
})

module.exports = mongoose.models.User || mongoose.model('User', UserSchema)