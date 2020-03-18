var mongoose = require('mongoose');
var mallSchema = new mongoose.Schema({
    "indexs": Number,
    "mallId": Number,
    "imgUrl": String
})

module.exports = mongoose.model('Mall', mallSchema);