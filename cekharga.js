var rp = require("request-promise");
var bp = require("body-parser");
var cherio = require("cheerio");
var puppeteer = require("puppeteer");
//let data = [];
// const cekharga = function(url) {
//     return rp(url).then(function(html) {
//       return {
//         nilai: cheerio('p > span', html).text().trim(),
//         harga: cheerio('div > p', html).text().trim(),
//       };
//     })
//     .catch(function(err) {
//       Console.log(err);
//     });
// }

// const cekharga = function(url) {
//     puppeter.launch().then(function(browser){
//         return browser.newPage();
//       }).then(function(page){
//         return page.goto(url).then(function(){
//           return page.content();
//         });
//       }).then(function(html){
//         var html_isi = "";
//         cheerio('p > span', html).each(function(err){ 
//           var temp_nilai = cheerio(this).text().trim();
//           if(html_isi===''){
//             html_isi = temp_nilai;
//           }
//           else{
//             html_isi = html_isi + "\n" + temp_nilai;
//           }
//           if(err){
//             console.log(err);
//           }
//         })
//         fs.writeFile("./harga/usd_5.txt", html_isi, function(err){
//           if(err){
//             console.log(err);
//           }
//         })
//       }).catch(function(err){
//         console.log(err);
//       })
    
// }

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

let bookingUrl = url[0];
(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(bookingUrl, {waitUntil: 'load', timeout: 0});
    await page.content();

    // get hotel details
    let dataharga = await page.evaluate(() => {
        let data = [];
        // get the hotel elements
        let hotelsElms = document.querySelectorAll('.product-grid-long');
        // get the hotel data
        hotelsElms.forEach((hotelelement) => {
            let dataJSON = {};
            try {
                // hotelJson.name = hotelelement.querySelector('span.sr-hotel__name').innerText;
                // hotelJson.reviews = hotelelement.querySelector('span.review-score-widget__subtext').innerText;
                // hotelJson.rating = hotelelement.querySelector('span.review-score-badge').innerText;
                // if(hotelelement.querySelector('strong.price')){
                //     hotelJson.price = hotelelement.querySelector('strong.price').innerText;
                // }
                let currency = element.children[1].children[0].children[0].innerText;
                currency = currency.replace(/\W/g, '');
                dataJSON.currency = currency.replace(/\d/g, '');
                let nilai = element.children[1].children[0].children[0].innerText;
                nilai = nilai.replace(/\D/g,'');
                dataJSON.nilai = Number(nilai);
                let harga = element.children[2].children[0].children[0].innerText;
                harga = harga.replace(/\D/g,'');
                dataJSON.harga = Number(harga);
                console.log(currency + ' ' + nilai + ' ' + harga);
            }
            catch (exception){

            }
            data.push(dataJSON);
        });
        return data;
    });

    console.dir(dataharga);
    browser.close();
})();
