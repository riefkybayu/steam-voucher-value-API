const fetch = require("node-fetch");
const mongoose = require('mongoose');
const url = "https://api.exchangeratesapi.io/latest";
const cur = require("./models/currency");

mongoose.connect('mongodb+srv://bayu:UCEK5Ts6LoiaFusU@riefkybayu-ox7jc.mongodb.net/steam-helper?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const currency = async(callback) => {
    const currency = await fetch(url).then((res) => res.json());
    let idr = ((1/currency.rates.USD)*currency.rates.IDR).toFixed(2);
    idr = Number(idr);
    const usd = 1;
    await callback(idr, usd); 
    mongoose.connection.close();
}

const update = async(idr, usd) => {
  await cur.countDocuments().exec().then(async(res) => {
      if(res > 0){
          await cur.updateOne({USD : usd}, {IDR : idr}).exec().then(res => console.log({"Update":res}));
      }else{
          const new_cur = new cur({
              //_id: new mongoose.Types.ObjectId(), 
              IDR : idr, 
              USD : usd,
          });
          await new_cur.save().then(res => console.log({"Insert":res}));
      };
  }).catch(err => console.log(err));
};

currency(update);