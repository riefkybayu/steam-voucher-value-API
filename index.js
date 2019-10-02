var fs = require("fs");
var express = require("express");
var bp = require("body-parser");
var cors = require("cors");
var app = express();
var final_pricing = require("./harga/final_pricing.json");
var nilai_usd = require("./harga/nilai_usd.json");
var nilai_idr = require("./harga/nilai_idr.json");
var rates = require("./harga/rates.json");

app.use(cors());
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();
today = yyyy + '-' + mm + '-' + dd;
today_str = today.toString();
var total =  [
    "usd_5", "usd_10", "usd_20", "usd_30", "usd_50", "usd_60", "usd_100",
    "idr_12000", "idr_45000", "idr_60000", "idr_90000", "idr_120000", "idr_250000", "idr_400000", "idr_600000",
];

let daily_check = async () => {
    try{
        fs.readFile("./data_ver/data_scrap.txt", "utf8", function(err, content){
            tanggal_update_scrap = content;
            if((tanggal_update_scrap==undefined)||(tanggal_update_scrap!==today_str)){
                tanggal_update_scrap = today_str;
                fs.writeFile("./data_ver/data_scrap.txt", tanggal_update_scrap, function(err){
                    if(err){
                      console.log(err);
                    }
                });
                var harga = require("./get_harga");
                var currency = require("./get_currency");
                var generator = require("./json_creator");
            }
        })
    }
    catch(err){
        console.log(err)
    }
}

let get_product_idr = async (nilai) => {
    let best_idr = nilai_idr.filter((nilai) => nilai >= temp_data);
    best_idr = best_idr[0];
    best_idr_index = nilai_idr.indexOf(best_idr);
    return best_idr;
}
let get_product_usd = async (nilai) => {
    let best_usd = nilai_usd.filter((nilai) => nilai >= temp_data);
    best_usd = best_usd[0];
    best_usd_index = nilai_usd.indexOf(best_usd);
    return best_usd;
}
daily_check();

app.get('/api/rates', (req, res) => {
    let nilai_idr = (1/rates.USD)*rates.IDR;
    nilai_idr = Number(nilai_idr).toFixed(2);
    nilai_idr = Number(nilai_idr);
    res.send(JSON.stringify({"IDR": nilai_idr, "USD":1}))
});
app.get('/api/harga',(req, res) => {
    res.send(final_pricing);
    
});

app.get('/api/harga/:nilai',(req, res) => {
    let temp_data = req.params.nilai;
    //nilai dan index idr
    let best_idr = nilai_idr.filter((nilai) => nilai >= temp_data);
    best_idr = best_idr[0];
    if(best_idr==undefined){
        best_idr_index = -1;
    } else{
        best_idr_index = nilai_idr.indexOf(best_idr)+7;;
    }
    //nilai dan index usd
    let best_usd = nilai_usd.filter((nilai) => nilai >= temp_data);
    best_usd = best_usd[0];
    best_usd_index = nilai_usd.indexOf(best_usd);
    
    //get product
    response_data = JSON.stringify({"usd" : final_pricing[best_usd_index], "idr" : final_pricing[best_idr_index]})
    res.send(response_data);
});

app.listen(3000,() =>{
    console.log('Server listening on port 3000...');
});