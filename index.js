const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const body = require("body-parser");

const currency = require("./script/models/currency");
const price = require("./script/models/price");


mongoose.connect('mongodb+srv://bayu:UCEK5Ts6LoiaFusU@riefkybayu-ox7jc.mongodb.net/steam-helper?retryWrites=true&w=majority', {
    useNewUrlParser: true, 
    useUnifiedTopology: true
});
var app = express();

app.use(cors());
app.use(body.json());

app.get('/api/currency/', (req, res) => {
    currency.find().exec().then(doc => {
        res.status(200).send(doc);
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
    let best_usd;
    let best_idr;
    try{
        await price.findOne({currency:"USD"})
        .where('nilai_idr').gt(nilai).exec().then(doc =>{
            best_usd = doc;
        })
        .catch(err => console.log(err));
    
        await price.findOne({currency:"IDR"})
        .where('nilai_idr').gt(nilai).exec().then(doc =>{
            best_idr = doc;
        })
        .catch(err => console.log(err));
        if(best_usd && best_idr){
            res.status(200).send(JSON.stringify({USD : best_usd, IDR : best_idr}));
        } else {
            if(best_usd){
                res.status(200).send(JSON.stringify({USD : best_usd, IDR : "BEST IDR NOT FOUND"}));
            } else if (best_idr){
                res.status(200).send(JSON.stringify({USD : "BEST USD NOT FOUND", IDR : best_idr}));
            } else {
                res.status(500).send("Data Not Found");
            }
        }  
    } catch {
        res.status(500).send("Data Not Found");
    }
});

app.listen(3000, (response) => console.log("Server listening from port 3000"));