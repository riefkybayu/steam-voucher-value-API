const mongoose = require("mongoose");

const currencySchema = mongoose.Schema({
    //_id : mongoose.Schema.Types.ObjectId,
    IDR : Number,
    USD : Number,
});

module.exports = mongoose.model('currency', currencySchema);