# steam-voucher-value-API

## How it works?
The price of steam voucher was scrapped with puppeteer from itemku ecommerce. And value was calculated based on daily exchange rates of USD-IDR, the rates itself was obtained with request-promise from exchange public API (https://exchangeratesapi.io/). 


## Installation
1. Clone this repo
2. Use NPM install in clone directories. make sure you have nodejs installed. Doing this will install all dependecies needed to run this server


## Usage
1. Run get_harga.js with "node get_harga" to get newest price with puppeteer, do it once a day.
2. Run get_currency.js with "node get_currency" to get newest exchange rates, do it once a day.
3. Run json_creator.js with "node json_creator" to make final json that will be used to as API, always run everytime harga/currency was updated. Usually only need to be run once a day after both harga and currency were run.
4. Run index.js with "node index", this will make server listing to all request to port 3000, you can change it as well if you need.  
NOTE : You will want to use nodejs process manager such as PM2 for production.


### GET /api/harga/
Get full price list with its value.

### GET /api/harga/:nilai  

Thats what you will request from the server, nilai has to be number.
What it does with nilai is that, it will find the best value close to nilai, and calculated the best price per value.
It will send back a respone in JSON, in this format :

{
  "idr" : [
    //value here as object{harga, nilai, value, link}
  ],
  "usd " [
    //value here as object{harga, nilai, value, link}
  ]
}

### GET /api/rates/
Since exchangerates public API was EUR based, fetching this API will give USD based rates(1 USD = ... IDR).  
JSON Format :

{
  "IDR" : number,
  "USD" : number
}