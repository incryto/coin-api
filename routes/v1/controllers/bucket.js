const axios = require('axios')

 async function getCurrentTotalPrice(bucket_coins){
  var tot = 0;
  const coin_map = new Map();
  coin_list = [];

  for (var coin in bucket_coins) {
    console.log(coin);
    coin_map.set(bucket_coins[coin]["id"], bucket_coins[coin]["quantity"]);
    coin_list.push(bucket_coins[coin]["id"]);
  }

  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&ids=${coin_list.join(
    "%2C"
  )}&order=market_cap_desc&per_page=100&page=1&sparkline=false`;
  console.log(url);
  var result = await axios.get(url)
  const time = Date.now()
  tot = 0;
  for (var i = 0; i < result["data"].length; i++) {
    const key = result["data"][i]["id"];
    tot += coin_map.get(key) * result["data"][i]["current_price"];
  }
  console.log(tot)
  console.log(time)
  return [tot,time]
}


async function getCurrentPrice(bucket_coins){
  console.log(bucket_coins)
  const coin_map = new Map();
  coin_list = [];
  for (var coin in bucket_coins) {
    coin_map.set(bucket_coins[coin]["id"], bucket_coins[coin]["quantity"]);
    coin_list.push(bucket_coins[coin]["id"]);
  }
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&ids=${coin_list.join(
    "%2C"
  )}&order=market_cap_desc&per_page=100&page=1&sparkline=false`;
  var result = await axios.get(url)
  return result.data
}


module.exports = {
  getCurrentTotalPrice,getCurrentPrice
}