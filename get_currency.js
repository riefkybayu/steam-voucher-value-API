var rp = require("request-promise");
var fs = require("fs");

var options = {
    uri: 'https://api.exchangeratesapi.io/latest',
    json: true
};
 
rp(options).then(function (currency) {
    tempcurrency = currency;
    temprates = JSON.stringify(tempcurrency.rates);
    fs.writeFile("./harga/rates.json", temprates, function(err){
        if(err){ console.log(err) };
    });
    tempdate = tempcurrency.date;
    fs.writeFile("./data_ver/data_time.txt", tempdate, function(err){
        if(err){ console.log(err) };
    });
}).catch(function (err) {
    console.log(err)
});
