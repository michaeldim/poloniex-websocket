// see https://poloniex.com/js/plx_exchage.js?v=081217
const WebSocket = require('ws');

const conn = new WebSocket('wss://api2.poloniex.com');

const CHANNELS = require('./channels');

conn.onopen = function (e) {
  // e.target --> connection
  console.log('Websocket connection opened');

  // accept channel both name (e.g. 'BTC_ETH') & number (148)
  conn.send(JSON.stringify({ command: 'subscribe', channel: CHANNELS.BTC_ETH }));
  // conn.send(JSON.stringify({command: "subscribe", channel: 'BTC_ETH'}))

  // ticker of all coins
  // conn.send(JSON.stringify({command: "subscribe", channel: 1002}))

  // conn.send(JSON.stringify({command: "subscribe", channel: 1001})) // nothing
  // conn.send(JSON.stringify({command: "subscribe", channel: 1003})) // nothing

  // conn.send(JSON.stringify({command: "subscribe", channel: 1000, userID: 'userid'})) //logged in only (private channel)

  // optional
  /*
  var keepAlive = setInterval(() => {
    try{ window.conn.send("."); }
    catch (err) { resetWebsocket(); }
  },60000);
  */
};

// [1002,null,[197,"0.01558447","0.01604035","0.01560846","-0.03836311","1670.36717561","108459.56500897",0,"0.01760551","0.01466600"]]

// [148,454753567,[["i",{"currencyPair":"BTC_ETH","orderBook":[{"0.04366319":"7.069
// [148,454753843,[["o",0,"0.04545356","0.00000000"],["o",0,"0.04551615","3.05000000"]]]
// [148,454777573,[["o",1,"0.04291794","0.00000000"],["o",1,"0.04292303","28.95979377"]]]
// [148,454777574,[["o",0,"0.04494991","26.77468403"],["t","38083358",1,"0.04494991","0.01000000",1513246446]]]

conn.onmessage = (e) => {
  const ticker = JSON.parse(e.data);
  let [channel, time, orders] = ticker;
  orders = orders.map((order) => {
    if (order[0] == 'i') { 		// channel info + full order book
      let [info] = order.slice(1);
      let {currencyPair: pair, orderBook: book} = info;
      let [offer_book, bid_book] = book;

      let top_offer = Object.keys(offer_book).sort().slice(0, 5).map(price => [price, offer_book[price]]);
      let top_bid = Object.keys(bid_book).sort().reverse().slice(0, 5).map(price => [price, bid_book[price]]);

      // optional print top bid/offer table
      /*
      console.log('Bid: ', top_bid);
      console.log('Offer: ', top_offer);
      */

      return ['info', pair, top_bid, top_offer];
    } else if (order[0] == 'o') { 	// new order
      let [type, price, amount] = order.slice(1);
      type = type == 1 ? 'buy' : 'sell';
      return ['order', type, price, amount];
    } else if (order[0] == 't') { // matched order
      let [matched_id, type, price, amount, time] = order.slice(1);
      type = type == 1 ? 'buy' : 'sell';
      return ['match', matched_id, type, price, amount, time];
    }
    return order;
  });

  console.log(channel, time, JSON.stringify(orders));
};

conn.onclose = function () {
  console.log('Websocket connection closed');
};
