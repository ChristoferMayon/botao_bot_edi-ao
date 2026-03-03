const mongoose = require('mongoose')
const CountrySchema = new mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true },
    id: { type: String, required: true, unique: true } // ex: BR, US, etc
}, { timestamps: true })
module.exports = mongoose.model('Country', CountrySchema)
