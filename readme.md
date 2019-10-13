# STEAM VOUCHER VALUE API

## HOW THE API WORKS
#### CURRENCY
###### The currency is obtained from https://api.exchangeratesapi.io which is an EUR based exchange rates, however this api will convert it to USD base.

#### Vouchers 
###### The price of vouchers is obtained by webscrapping itemku.com, currently this api will scrap USD vouchers and IDR voucher only.

## USAGE
#### Installation 
###### 1. Clone/Download this repo
###### 2. Install Node(if you dont have node installed in your system)
###### 3. Open terminal in the directory of this repo
###### 4. run "npm install --save" on terminal to install all dependecies required. Will takes several minutes since puppeteer also need chromium which is around 170mb

#### Run the Script
###### 1. run "npm run cur" to update currency. Do this daily
###### 2. run "npm run price" to update price list. Do this daily
###### 3. run "npm start" to start listening for request of API

## API
### GET /api/currency/
#### Will give you the rates for IDR and USD. this rates is USD based.

### GET /api/price/
#### Will give you the price list, the format is going to be array of objects, and the object will be formatted in :
_id : object_ID  
link : String,  
produk : String,  
currency : String,  
nilai_idr : Number,  
harga : Number,  
harga_asli : Number,  
diskon : Boolean,  
nilai : Number  

### GET /api/price/:nilai
#### Will give you the closest greater value than your input for both USD voucher and IDR voucher, the format is going array of 2 object. USD and IDR, the object will be formatted in :
_id : object_ID  
link : String,  
produk : String,  
currency : String,  
nilai_idr : Number,  
harga : Number,  
harga_asli : Number,  
diskon : Boolean,  
nilai : Number  


## CHANGES
### This rest api app now use mongodb Atlas to store data instead of json files in the app, you can use your own database server if you want by changing url string in mongoose.connect in index.js, fetch_price.js, and fetch_currency.js. Also optimize puppeteer scrapping.