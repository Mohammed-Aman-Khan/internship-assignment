const mongoose = require('mongoose')

const GiftBoxSchema = mongoose.Schema({
    name: String,
    creatorId: mongoose.Types.ObjectId,
    gifts: [ mongoose.Types.ObjectId ],
    creationTimeStamp: String,
    upvotes: [ mongoose.Types.ObjectId ],
    downvotes: [ mongoose.Types.ObjectId ],
})

module.exports = mongoose.models.GiftBox || mongoose.model('GiftBox', GiftBoxSchema)