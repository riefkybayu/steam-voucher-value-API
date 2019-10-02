var puppeteer = require("puppeteer");
var fs = require("fs");
const sleep = ms => new Promise(resolve => { setTimeout(resolve, ms) });
const url = [
    "https://itemku.com/games/steam?page=1&game=43&type=39&sort_by=1&item=2863&group=3",
    "https://itemku.com/games/steam?page=1&game=43&type=39&sort_by=1&item=2864&group=3",
    "https://itemku.com/games/steam?page=1&game=43&type=39&sort_by=1&item=2867&group=3",
    "https://itemku.com/games/steam?page=1&game=43&type=39&sort_by=1&item=2868&group=3",
    "https://itemku.com/games/steam?page=1&game=43&type=39&sort_by=1&item=2869&group=3",
    "https://itemku.com/games/steam?page=1&game=43&type=39&sort_by=1&item=2870&group=3",
    "https://itemku.com/games/steam?page=1&game=43&type=39&sort_by=1&item=3260&group=3",
    "https://itemku.com/games/steam?page=1&game=43&type=39&sort_by=1&item=2853&group=4",
    "https://itemku.com/games/steam?page=1&game=43&type=39&sort_by=1&item=2854&group=4",
    "https://itemku.com/games/steam?page=1&game=43&type=39&sort_by=1&item=2855&group=4",
    "https://itemku.com/games/steam?page=1&game=43&type=39&sort_by=1&item=2856&group=4",
    "https://itemku.com/games/steam?page=1&game=43&type=39&sort_by=1&item=2857&group=4",
    "https://itemku.com/games/steam?page=1&game=43&type=39&sort_by=1&item=2858&group=4",
    "https://itemku.com/games/steam?page=1&game=43&type=39&sort_by=1&item=2859&group=4",
    "https://itemku.com/games/steam?page=1&game=43&type=39&sort_by=1&item=2860&group=4"
];
const path = [
    "./harga/usd/usd_5", 
    "./harga/usd/usd_10",
    "./harga/usd/usd_20", 
    "./harga/usd/usd_30", 
    "./harga/usd/usd_50", 
    "./harga/usd/usd_60", 
    "./harga/usd/usd_100", 
    "./harga/idr/idr_12000", 
    "./harga/idr/idr_45000", 
    "./harga/idr/idr_60000", 
    "./harga/idr/idr_90000",
    "./harga/idr/idr_120000",
    "./harga/idr/idr_250000",
    "./harga/idr/idr_400000",
    "./harga/idr/idr_600000",
]

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();
today = yyyy + '-' + mm + '-' + dd;
today_str = today.toString();


require('events').EventEmitter.defaultMaxListeners = 15;
let getHarga = async(url_pass) => {
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
      let link = element.href;
      let currency = element.children[1].children[0].children[0].innerText;
      currency = currency.replace(/\W/g, '');
      currency = currency.replace(/\d/g, '');
      let nilai = element.children[1].children[0].children[0].innerText;
      nilai = nilai.replace(/\D/g,'');
      nilai = Number(nilai);
      let harga;
      try {
        harga = element.children[2].children[0].children[1].innerText;
      } catch (error) {
        harga = element.children[2].children[0].children[0].innerText;
      }
      harga = harga.replace(/\D/g,'');
      harga = Number(harga);
      check = check+1;
      data.push({ link, currency, nilai, harga })
      console.log(data);
    }
    return data;
  });
  browser.close();
  return result;
};


let inisialisasi = async(start, end) => {
  for(let i=start; i<=end; i++) {
      getHarga(url[i]).then((Value) => {
          var tempdata = Value;
          var temppath = path[i]+".json";
          var jsondata = JSON.stringify(tempdata);
          fs.writeFile(temppath, jsondata, function(err){
              if(err){console.log(err);}
          });
          
      });
    await sleep(15000);
  };
  return "Data Succesfully Updated";
};


let do_check = async() => {
  var today_scrap;
  fs.readFile("./data_ver/data_scrap.txt", "utf8", function(err, content){
    if(err){console.log(err)};
    today_scrap = content;
    if((today_scrap==undefined)||(today_scrap!=today_str)){
      inisialisasi(0, 14);
      fs.writeFile("./data_ver/data_scrap.txt", today_str, function (err){
        if(err){ console.log(err) };
      })
    } else {console.log("Data is uptodate")}
  })
}

do_check();
