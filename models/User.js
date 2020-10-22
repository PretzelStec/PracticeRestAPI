const mongoose = require('mongoose');
require('mongoose-type-email');

const User = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userName: String,
    email: mongoose.SchemaTypes.Email,
    password: String,
    companyID : String
})

module.exports = mongoose.model('user', User);