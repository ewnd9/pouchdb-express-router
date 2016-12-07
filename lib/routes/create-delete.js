'use strict';

var jsonParser = require('body-parser').json({limit: '1mb'});

module.exports = function(app, PouchDB) {

  ['/:db/*','/:db'].forEach(function (route) {
    app.all(route, function (req, res, next) {
      var name = encodeURIComponent(req.params.db);
      req.db = new PouchDB(name);
      next();
    });
  });

  // Create a database
  app.put('/:db', jsonParser, function (req, res, next) {
    var name = encodeURIComponent(req.params.db);
    var db = new PouchDB(name);
    db.info().then(function() {
      res.status(201).send({ok: true});
    }).catch(function(err) {
      res.status(412).send(err);
    });
  });

  // Delete a database
  app.delete('/:db', function (req, res, next) {
    var name = encodeURIComponent(req.params.db);
    new PouchDB(name).destroy(function (err, info) {
      if (err) return res.status(500).send(err);
      res.status(200).send({ok: true });
    });
  });

  return app;
};
