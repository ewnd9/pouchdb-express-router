'use strict';

var express = require('express');

var routes = {
  'db': require('./lib/routes/db.js'),
  'document': require('./lib/routes/document.js'),
  'attachments': require('./lib/routes/attachments.js'),
  'setDb': require('./lib/routes/set-db'),
  'createDelete': require('./lib/routes/create-delete.js')
};

module.exports = function(PouchDB) {
  var app = createRoute(function(app) {
    routes.createDelete(app, PouchDB);

    var subRouter = express.Router();
    app.use('/:db', subRouter);

    return subRouter;
  });

  app.get('/', function (req, res) {
    res.status(200).send({'pouchdb-express-router': 'Welcome!'});
  });

  app.get('/_session', function (req, res) {
    res.status(200).send({
      'ok': true,
      'userCtx':{"name":null,"roles":["_admin"]}
    });
  });

  return app;
};

module.exports.pouchRoute = function(db) {
  return createRoute(function(app) {
    return routes.setDb(app, db);
  });
};

function createRoute(setupDb) {
  var app = express.Router();

  app.use(function (req, res, next) {
    for (var prop in req.query) {
      try {
        req.query[prop] = JSON.parse(req.query[prop]);
      } catch (e) {}
    }
    next();
  });

  var subRouter = setupDb(app);

  routes.db(subRouter);
  routes.attachments(subRouter);
  routes.document(subRouter);

  app.use(function (req, res) {
    res.status(404).send( {
      error: "not_found",
      reason: "missing"
    });
  });

  return app;
};

// Used for testing porpoises
// var PouchDB = require('pouchdb');
// var app = express();
// app.use(module.exports(PouchDB));
// app.listen(5985);
