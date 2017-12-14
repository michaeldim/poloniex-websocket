const axios = require('axios');

const PERIOD = {
  '5_MIN': 5 * 60,
  '15_MIN': 15 * 60,
  '30_MIN': 30 * 60,
  '2_HOUR': 2 * 60 * 60,
  '4_HOUR': 4 * 60 * 60,
  '1_DAY': 24 * 60 * 60,
};

async function fetchTicker() {
  const result = await axios.get('https://poloniex.com/public?command=returnTicker');
  const data = result.data;
  console.log(data.BTC_ETH);
}

async function fetchChartData() {
  const pair = 'BTC_ETH';
  const period = PERIOD['1_DAY'];
  const start = Date.now() - 30 * period;
  const result = await axios.get(`https://poloniex.com/public?command=returnChartData&currencyPair=${pair}&start=${start}&end=9999999999&period=${period}`);
  const data = result.data;
  console.log(data);
}

fetchTicker();
fetchChartData();
