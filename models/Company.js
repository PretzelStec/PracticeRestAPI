const mongoose = require('mongoose');

const Company = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    companyID: String,
    name: String,
    address: String
})

module.exports = mongoose.model('company', Company);