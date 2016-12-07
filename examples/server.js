'use strict';

var PouchDB = require('pouchdb-node').defaults({
  prefix: '/tmp/'
});

var express = require('express');
var pouchServer = require('../');

function createApp() {
  var app = express();
  app.use('/db', pouchServer(PouchDB));

  return app;
}

module.exports = createApp;

if (!module.parent) {
  var app = createApp();

  app.listen(3000, err => {
    if (err) {
      throw err;
    }

    console.log('listening localhost:3000');
  });
}
