#!/usr/bin/env node

var Primus = require('primus'),
    http   = require('http'),
    colour  = '#f4f4f4';

var server = http.createServer().listen(8080),
    primus = new Primus(server);

primus.on('connection', function (spark) {
  // spark is the new connection.
  console.log('Detected connection');

  console.log('Emitting colour');
  primus.write({'colour': colour});

  spark.on('data', function (data) {
    console.log('Received data from spark');
    console.log(data);

    if('colour' in data) {
      primus.write({'colour': data.colour});
      colour = data.colour;
    }
  });
});