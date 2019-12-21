const express = require('express');
const next = require('next');

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressSession = require('express-session');

require('dotenv').config();
const routes = require('./routes');

const dev = process.env.NODE_ENV !== 'production';

const nextApp = next({
  dev,
});

const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  const expressServer = express();

  expressServer.use(cookieParser());

  expressServer.use(
    expressSession({
      secret: 'keyboard cat',
      resave: true,
      saveUninitialized: false,
    })
  );

  expressServer.use(bodyParser.json());
  expressServer.use(bodyParser.urlencoded({ extended: true }));

  // intercept custom routes
  expressServer.use(routes);

  // all other routes go to nextjs
  expressServer.get('*', (req, res) => {
    return handle(req, res);
  });

  expressServer.use(function(err, req, res, next) {
    // fallback error handler
    console.log(
      `fallback handler: ${err}`
    );

    if (res.headersSent) {
      console.log(err);
      return next(err);
    } else {
      console.log(err);
      res.status(500).send(err);
    }
  });

  expressServer.listen(process.env.PORT, () => {
    console.log(`> Listening on http://localhost:${process.env.PORT}`);
  });

  expressServer.on('', function(err) {
    console.log(`last ditch handler: ${err}`);
  });
});
