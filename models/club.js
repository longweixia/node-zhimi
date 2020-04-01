var mongoose = require('mongoose');
var clubSchema = new mongoose.Schema({
    "userName": String,
    "shareList":[]
})

module.exports = mongoose.model('Club', clubSchema);