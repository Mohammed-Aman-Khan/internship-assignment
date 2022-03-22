const mongoose = require('mongoose')

const GiftSchema = mongoose.Schema({
    name: String,
    price: String,
    description: String,
})

module.exports = mongoose.models.Gift || mongoose.model('Gift', GiftSchema)