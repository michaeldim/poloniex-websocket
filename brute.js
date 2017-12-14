const WebSocket = require('ws');

const conn = new WebSocket('wss://api2.poloniex.com');

let channel_id = 1;

conn.onopen = () => {
  console.log('Websocket connection opened');
  conn.send(JSON.stringify({ command: 'subscribe', channel: channel_id }));
};

conn.onmessage = (e) => {
  const data = JSON.parse(e.data);
  if (data instanceof Array
    && data.length > 2
    && data[2] instanceof Array
    && data[2][0][0] == 'i') {
    console.log(data[0], data[2][0][1].currencyPair);
  }
  conn.send(JSON.stringify({ command: 'unsubscribe', channel: channel_id }));
  channel_id++;
  conn.send(JSON.stringify({ command: 'subscribe', channel: channel_id }));
};

conn.onclose = () => {
  console.log('Websocket connection closed');
};
