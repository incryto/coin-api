require('dotenv').config()
const axios = require('axios')
const coin = require('./../routes/v1/models/coin')

function setCoinPrices() {
    axios.get(`http://api.coinlayer.com/api/live?access_key=${process.env.COIN_LAYER_ACCESS}`).then((response) => {
        console.log(response.data.rates)
        
        Object.keys(response.data.rates).forEach(function(key) {
            // console.log('Key : ' + key + ', Value : ' + response.data.rates[key])
            var newcoin = new coin({
                "label":key,
                "price":response.data.rates[key],
            })
            newcoin.save()
          })

    }).catch((error) => {
        console.log(error)
    });
}

function getCoins(){
    coin.find({date: {
        $gte: new Date(2022, 7, 29), 
        $lt: new Date(2022, 7, 31)
    }}).then((value)=>{
        console.log(value)
    })
}

module.exports = {setCoinPrices,getCoins}