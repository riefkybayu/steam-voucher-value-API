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
        let usd_index;
        let idr_index;
        let first_voucher;
        let second_voucher;
        let maksimal = false;

        try{
            usd_index = best_usd.index.index;
            idr_index = best_usd.index.index;
        }catch{
            usd_index = 6; 
            idr_index = 7;
            maksimal = true;
        }
        
        if((usd_index!=0)&&(idr_index!=0)){
            if(maksimal){
                first_voucher = await prev_best(usd_index+1, idr_index+1);
            }else{
                first_voucher = await prev_best(usd_index, idr_index);
            }
            second_voucher = await uni_best(nilai-first_voucher.nilai_idr);
        } else if ((usd_index!=0)||(idr_index!=0)){
            if(usd_index!=0){
                first_voucher = await prev_best_single("USD", usd_index);
            } else {
                first_voucher = await prev_best_single("IDR", idr_index);
            }
            second_voucher = await uni_best(nilai-first_voucher.nilai_idr);
        } else{
            first_voucher = null;
            second_voucher = null;
        }
        try{
            res.status(200).send(JSON.stringify({single:{USD : best_usd, IDR : best_idr}, 
                double:{total: first_voucher.harga+second_voucher.harga,first:first_voucher, second:second_voucher}}));
        }catch{
            res.status(200).send(JSON.stringify({single:{USD : best_usd, IDR : best_idr}}));
        }

    } catch {
        res.status(500).send("Data Not Found");
    }
});

app.listen(3000, (response) => console.log("Server listening from port 3000"));

//logic here
const best_one = async(param_currency, nilai) => {
    const doc = await price.findOne({currency:param_currency})
    .where('nilai_idr').gt(nilai-1).exec()
    .then(doc => doc).catch(err => {return "Data tidak ditemukan"});
    return doc;
}

const prev_best = async(index_usd, index_idr) => {
    let doc;
    const usd = await price.findOne({currency:"USD"}).where({"index.index":index_usd-1}).exec()
    .then(doc => doc).catch(err => console.log(err));

    const idr = await price.findOne({currency:"IDR"}).where({"index.index":index_idr-1}).exec()
    .then(doc => doc).catch(err => console.log(err));

    if(usd.nilai_idr > idr.nilai_idr){
        doc = usd;
    } else {
        doc = idr;
    }
    return doc;
}

const prev_best_single = async(param_currency, index) => {
    const usd = await price.findOne({currency:param_currency}).where({"index.index":index-1}).exec()
    .then(doc => doc).catch(err => console.log(err));
}

const uni_best = async(nilai)=> {
    const usd = await best_one("USD", nilai);
    const idr = await best_one("IDR", nilai);
    let doc;
    if(usd.nilai>idr.nilai){
        doc = usd;
    } else {
        doc = idr;
    }
    return doc;
}


