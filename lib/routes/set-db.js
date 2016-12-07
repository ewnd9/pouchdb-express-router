'use strict';

module.exports = function(app, db) {
  ['/*','/'].forEach(function (route) {
    app.all(route, function (req, res, next) {
      req.db = db;
      next();
    });
  });

  return app;
};
