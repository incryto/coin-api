const axios = require('axios')


function getCoinPrice(coins){
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&ids=${coins.join('%2C')}&order=market_cap_desc&per_page=100&page=1&sparkline=false`
    axios.get(url).then((result) => {
        tot = 0
        for(var coin in result){
            tot+=coin["current_price"]
        }
        return tot
    })
}

module.exports  ={
    getCoinPrice
}