'use strict';

var PouchDB = require('pouchdb-node');

var express = require('express');
var pouchRoute = require('../').pouchRoute;

function createApp() {
  var app = express();
  var db = new PouchDB('/tmp/db');

  app.use('/db1', pouchRoute(db));

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
