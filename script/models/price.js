const mongoose = require("mongoose");

const priceSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    link : String,
    produk : String,
    currency : String,
    nilai_idr : Number,
    harga : Number,
    harga_asli : Number,
    diskon : Boolean,
    nilai : Number
});

module.exports = mongoose.model('price', priceSchema);