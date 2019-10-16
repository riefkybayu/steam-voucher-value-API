const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const body = require("body-parser");

const currency = require("./script/models/currency");
const price = require("./script/models/price");
const url = require("./script/url/url").array;
console.log(url);

mongoose.connect('mongodb+srv://bayu:UCEK5Ts6LoiaFusU@riefkybayu-ox7jc.mongodb.net/steam-helper?retryWrites=true&w=majority', {
    useNewUrlParser: true, 
    useUnifiedTopology: true
});
var app = express();

app.use(cors());
app.use(body.json());

app.get('/api/currency/', (req, res) => {
    currency.find().exec().then(doc => {
        res.status(200).send(doc[0]);
    }).catch(err => {
        res.status(500).send(JSON.stringify({"Error":err}));
    })
});

app.get('/api/price/', (req, res) => {
    price.find().exec().then(doc => {
        res.status(200).send(doc);
    }).catch(err => {
        res.status(500).send(JSON.stringify({"Error":err}));
    })
});

app.get('/api/price/:nilai', async (req, res) => {
    nilai = req.params.nilai;
    try{
        const best_usd = await best_one("USD", nilai);
        const best_idr = await best_one("IDR", nilai);
        res.status(200).send(JSON.stringify({USD : best_usd, IDR : best_idr}));
    } catch {
        res.status(500).send("Data Not Found");
    }
});

let best_one = async(param_currency, nilai) => {
    const doc = await price.findOne({currency:param_currency})
    .where('nilai_idr').gt(nilai).exec()
    .then().catch(err => console.log(err));
    return doc;
}


app.listen(3000, (response) => console.log("Server listening from port 3000"));