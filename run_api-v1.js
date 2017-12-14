// see https://poloniex.com/js/plx_exchage.js?v=081217
const autobahn = require('autobahn');

const wsuri = 'wss://api.poloniex.com:443';
const connection = new autobahn.Connection({
  url: wsuri,
  realm: 'realm1',
});

connection.onopen = function (session) {
  console.log('Websocket connection opened');
  function marketEvent(args, kwargs) {
    console.log(args, kwargs);
  }
  function tickerEvent(args, kwargs) {
    console.log(args, kwargs);
  }
  function trollboxEvent(args, kwargs) {
    console.log(args, kwargs);
  }
  session.subscribe('BTC_ETH', marketEvent);
  session.subscribe('ticker', tickerEvent);
  session.subscribe('alerts', tickerEvent);
  session.subscribe('heartbeat', tickerEvent);
  session.subscribe('footer', tickerEvent);
  // session.subscribe('trollbox', trollboxEvent);
};

connection.onmessage = function (e) {
  console.log(e);
};

connection.onclose = function () {
  console.log('Websocket connection closed');
};

connection.open();
