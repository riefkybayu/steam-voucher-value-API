var express = require("express");
var rp = require("request-promise");
var bp = require("body-parser");
var cheerio = require("cheerio");
var fs = require("fs");
var puppeteer = require("puppeteer");
var harga_total_json = require("./harga/harga_total.json");

var app = express();
const url_currency = "https://api.exchangeratesapi.io/latest";
const url_usd = [
  "https://itemku.com/games/steam?page=1&game=43&type=39&sort_by=1&item=2863&group=3",
  "https://itemku.com/games/steam?page=1&game=43&type=39&sort_by=1&item=2864&group=3",
  "https://itemku.com/games/steam?page=1&game=43&type=39&sort_by=1&item=2867&group=3",
  "https://itemku.com/games/steam?page=1&game=43&type=39&sort_by=1&item=2868&group=3",
  "https://itemku.com/games/steam?page=1&game=43&type=39&sort_by=1&item=2869&group=3",
  "https://itemku.com/games/steam?page=1&game=43&type=39&sort_by=1&item=2870&group=3",
  "https://itemku.com/games/steam?page=1&game=43&type=39&sort_by=1&item=3260&group=3"
];
const url_idr = [
  "https://itemku.com/games/steam?page=1&game=43&type=39&sort_by=1&item=2853&group=4",
  "https://itemku.com/games/steam?page=1&game=43&type=39&sort_by=1&item=2854&group=4",
  "https://itemku.com/games/steam?page=1&game=43&type=39&sort_by=1&item=2855&group=4",
  "https://itemku.com/games/steam?page=1&game=43&type=39&sort_by=1&item=2856&group=4",
  "https://itemku.com/games/steam?page=1&game=43&type=39&sort_by=1&item=2857&group=4",
  "https://itemku.com/games/steam?page=1&game=43&type=39&sort_by=1&item=2858&group=4",
  "https://itemku.com/games/steam?page=1&game=43&type=39&sort_by=1&item=2859&group=4",
  "https://itemku.com/games/steam?page=1&game=43&type=39&sort_by=1&item=2860&group=4"
];
var data_pool = [];

var tanggal_update_time;

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();
today = yyyy + '-' + mm + '-' + dd;
today_str = today.toString();


require('events').EventEmitter.defaultMaxListeners = 15;
// rp(url_5)
//   .then(function(html){
//     //success!
//     fs.writeFile("./test.html", html, function(err){
//         if(err){
//             console.log(err);
//         }
//     })   
//   })
//   .catch(function(err){
//     console.log(err);
//   });

// (async () => {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   await page.goto(url_5);
 
//   // Get the "viewport" of the page, as reported by the page.
//   const harga = await page.evaluate(() => {
//     const harga_list = [];

//     return {
      
//     };
//   });
 
//   console.log('Dimensions:', dimensions);
 
//   await browser.close();
// })();

let scrape = async (url_pass) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url_pass, {waitUntil: 'load', timeout: 0});
  await page.content();

  const result = await page.evaluate(() => {
    var check = 0;
    let data = [];
    let elements = document.querySelectorAll('.product-grid-long');
    for(var element of elements){
      if(check >= 3){
        break;
      }
      let currency = element.children[1].children[0].children[0].innerText;
      currency = currency.replace(/\W/g, '');
      currency = currency.replace(/\d/g, '');
      let nilai = element.children[1].children[0].children[0].innerText;
      nilai = nilai.replace(/\D/g,'');
      nilai = Number(nilai);
      let harga = element.children[2].children[0].children[0].innerText;
      harga = harga.replace(/\D/g,'');
      harga = Number(harga);
      check = check+1;
      data.push({ currency, nilai, harga })
    }
    return data;
  });
  browser.close();
  return result;
};

// for(let i = 0; i < 7; i++){
//   scrape(url_usd[i]).then((value) => {
//     tempurl = "./harga/usd/usd"+(i+1)+".json";
//     tempvalue = JSON.stringify(value)
//     fs.writeFile(tempurl, tempvalue, function(err) {
//        if(err){console.log(err)}
//      });
//   });
// };
// for(let i = 0; i < 8; i++){
//   scrape(url_idr[i]).then((value) => {
    // tempurl = "./harga/idr/idr"+(i+1)+".json";
    // tempvalue = JSON.stringify(value)
    // fs.writeFile(tempurl, tempvalue, function(err) {
    //    if(err){console.log(err)}
//      });
//   });
// };
var promises = [];
var tanggal_update_scrap;
function tulisdata() {
  fs.readFile("./data_ver/data_scrap.txt", 'utf8', function(err, content){
    tanggal_update_scrap = content;
    if((tanggal_update_scrap==undefined)||(tanggal_update_scrap!==today_str)){
      tanggal_update_scrap = today_str;
      fs.writeFile("./data_ver/data_scrap.txt", tanggal_update_scrap, function(err){
        if(err){
          console.log(err);
        }
      });
      for(let i=0;i<1;i++){
        promises.push(scrap_idr(i));
      }
      for(let j=0;j<1;j++){
        promises.push(scrap_usd(j));
      }
      Promise.all(promises).then((result) => {
        tempvalue = JSON.stringify(result)
        fs.writeFile("./harga/harga_total.json", tempvalue, function(err) {
           if(err){console.log(err)}
        });
      }).catch((e) =>{
        console.log(e);
      })
    }
    else{
      console.log("Data Updated");
    }
  });
}

function scrap_idr(i) {
  return new Promise((resolve) => {
    setTimeout(() => {
      scrape(url_idr[i]).then((value) => {
      //data_pool = value;
      resolve(value);
      })
    })
  })
}


function scrap_usd(i) {
  return new Promise((resolve) => {
    setTimeout(() => {
      scrape(url_usd[i]).then((value) => {
      resolve(value);
      })
    })
  })
}


// let storejson = async(data_pass) =>{
//   tempurl = "./harga/hargatotal.json";
  // tempvalue = JSON.stringify(data_pass)
  // fs.writeFile(tempurl, tempvalue, function(err) {
  //    if(err){console.log(err)}
  // });
// };
tulisdata();

app.get('/api/harga', (req, res) => {
  res.send(harga_total_json);
});
app.listen(3000,() =>{
  console.log('Server started on port 3000...');
});

