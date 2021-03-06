const puppeteer = require("puppeteer");
const mongoose = require('mongoose');
const price = require("./models/price");
const currency = require("./models/currency");
const url = require("./url/url").array;

mongoose.connect('mongodb+srv://bayu:UCEK5Ts6LoiaFusU@riefkybayu-ox7jc.mongodb.net/steam-helper?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

let get_harga = async(url_pass) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url_pass, {waitUntil: 'load', timeout: 0});
    await page.content();
    
    const result = await page.evaluate(() => {
      var check = 0;
      let data = [];
      let elements = document.querySelectorAll('.product-grid-long');
      for(var element of elements){
        if(check >= 1){
          break;
        }
        let link = element.href;
        let product = element.children[1].children[0].children[0].innerText;
        let currency = product.replace(/\W/g, '');
        currency = currency.replace(/\d/g, '');
        let nilai = element.children[1].children[0].children[0].innerText;
        nilai = nilai.replace(/\D/g,'');
        nilai = Number(nilai);
        let harga;
        let harga_asli;
        try {
          harga = element.children[2].children[0].children[1].innerText;
          harga_asli = element.children[2].children[0].children[0].innerText;
        } catch (error) {
          harga = element.children[2].children[0].children[0].innerText;
          harga_asli = harga;
        }
        harga = harga.replace(/\D/g,'');
        harga = Number(harga);
        harga_asli = harga_asli.replace(/\D/g,'');
        harga_asli = Number(harga_asli);
        check = check+1;
        data.push({ link, product, currency, nilai, harga, harga_asli })
      }
      return data;
    });
    browser.close();
    return result[0];
};

const init = async() => {
    const idr_value = await currency.find().exec().then(result => result[0].IDR);
    await price.deleteMany().exec();
    for(let i=0;i<url.length;i++){
        await get_harga(url[i]).then(async (res) => {
            const temp_diskon = !(res.harga === res.harga_asli);
            let temp_nilai_idr = 0;
            let temp_nilai = 0;
            if(res.product.includes("USD")){
              temp_nilai_idr = res.nilai*idr_value;
            } else{
              temp_nilai_idr = res.product.replace(/\D/g,'');
              temp_nilai_idr = Number(temp_nilai_idr);
            }
            temp_nilai = temp_nilai_idr/res.harga;
            let temp_index = i;
            if(i>=7){
              temp_index = i-7;
            }
            const new_price = new price({
              //_id :new mongoose.Types.ObjectId(),
              index : {
                currency : res.currency,
                index : temp_index
              },
              link : res.link,
              produk : res.product,
              currency : res.currency,
              nilai_idr : temp_nilai_idr,
              harga : res.harga,
              harga_asli : res.harga_asli,
              diskon : temp_diskon,
              nilai : temp_nilai
            });
            await new_price.save().then(result => console.log("Sukses : "+ result)).catch(err => console.log("Gagal : "+ err));
        }).catch(err => {
            console.log(err)
        });
    };
    mongoose.connection.close()  
};

init();

