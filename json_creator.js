var fs = require("fs");
const sleep = ms => new Promise(resolve => { setTimeout(resolve, ms) });
var rate = require("./harga/rates.json");
var idr = rate.IDR;
var usd = rate.USD;

var usd_5 = require("./harga/usd/usd_5.json");
var usd_10 = require("./harga/usd/usd_10.json");
var usd_20 = require("./harga/usd/usd_20.json");
var usd_30 = require("./harga/usd/usd_30.json");
var usd_50 = require("./harga/usd/usd_50.json");
var usd_60 = require("./harga/usd/usd_60.json");
var usd_100 = require("./harga/usd/usd_100.json");
var idr_12000 = require("./harga/idr/idr_12000.json");
var idr_45000= require("./harga/idr/idr_45000.json");
var idr_60000 = require("./harga/idr/idr_60000.json");
var idr_90000 = require("./harga/idr/idr_90000.json");
var idr_120000 = require("./harga/idr/idr_120000.json");
var idr_250000 = require("./harga/idr/idr_250000.json");
var idr_400000 = require("./harga/idr/idr_400000.json");
var idr_600000 = require("./harga/idr/idr_600000.json");

var total =  [
    usd_5, usd_10, usd_20, usd_30, usd_50, usd_60, usd_100,
    idr_12000, idr_45000, idr_60000, idr_90000, idr_120000, idr_250000, idr_400000, idr_600000
];
var total_pool = [ 
    pool_usd_5 = [], pool_usd_10 = [], pool_usd_20 = [], pool_usd_30 = [], 
    pool_usd_50 = [], pool_usd_60 = [], pool_usd_100 = [],
    pool_idr_12000 = [], pool_idr_45000 = [], pool_idr_60000 = [], pool_idr_90000 = [], pool_idr_120000 = [],
    pool_idr_250000 = [], pool_idr_400000 = [], pool_idr_600000 = []
]

var nilai_usd = [];
var nilai_idr = [];

let pooling = async (link, currency, nilai, harga) => {
    var datapool= [];
    var tempdata = {};
    tempdata.link = link;
    tempdata.currency = currency;
    tempdata.nilai = nilai;
    if(currency==="IDR"){
        tempdata.nilai_idr = nilai;
    }
    else{
        var conv = (1/usd)*idr;
        tempdata.nilai_idr = nilai*conv;
        tempdata.nilai_idr = Number(tempdata.nilai_idr).toFixed(0);
        tempdata.nilai_idr = Number(tempdata.nilai_idr);
    }
    tempdata.harga = harga;
    datapool.push(tempdata);
    return datapool;
}

let doinit = async() => {
    try{
        for(let i=0; i<total.length; i++){
            var tempinit = total[i];
            for(let j=0; j<tempinit.length; j++){
                pooling(tempinit[j].link, tempinit[j].currency, tempinit[j].nilai, tempinit[j].harga).then((value)=>{
                    if(j==0){
                        if(i<=6){
                            nilai_usd.push(value[0].nilai_idr);
                        }else{
                            nilai_idr.push(value[0].nilai_idr);
                        } 
                    }
                    total_pool[i].push(value);
                })
                await sleep(1000);
            }
            await sleep(1000);
        }
    }
    catch(err){
        console.log(err);
    };
}


doinit()
.then(() => {
   try{
        fs.writeFile("./harga/final_pricing.json", JSON.stringify(total_pool
            // "usd_5": total_pool[0],
            // "usd_10": total_pool[1],
            // "usd_20": total_pool[2],
            // "usd_30": total_pool[3],
            // "usd_50": total_pool[4],
            // "usd_60": total_pool[5],
            // "idr_100": total_pool[6],
            // "idr_12000": total_pool[7],
            // "idr_45000": total_pool[8],
            // "idr_60000": total_pool[9], 
            // "idr_90000": total_pool[10], 
            // "idr_120000": total_pool[11], 
            // "idr_250000": total_pool[12], 
            // "idr_400000": total_pool[13],
            // "idr_600000": total_pool[14]
        ), function(err){
            if(err){console.log(err)}
        });
        fs.writeFile("./harga/nilai_usd.json", JSON.stringify(nilai_usd), function(err){
            if(err){console.log(err)}
        });
        fs.writeFile("./harga/nilai_idr.json", JSON.stringify(nilai_idr), function(err){
            if(err){console.log(err)}
        })
   } catch(err){
       console.log(err);
   }
    
})



