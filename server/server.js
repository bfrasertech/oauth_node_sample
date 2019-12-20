require('dotenv').config();

const express = require('express');
const next = require('next');

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressSession = require('express-session');

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

  expressServer.get('*', (req, res) => {
    return handle(req, res);
  });

  expressServer.use(function(err, req, res, next) {
    // fallback error handler
    logger.logException(
      `Unhandled exception caught in express fallback handler: ${err}`
    );

    if (res.headersSent) {
      return next(err);
    } else {
      res.status(500).send('An application error occurred. Please contact IT');
      // res.render('error', { error: err });
    }
  });

  expressServer.listen(process.env.PORT, () => {
    console.log(`> Listening on http://localhost:${process.env.PORT}`);
  });

  expressServer.on('', function(err) {
    logger.logTrace(`Catch all handler ${err}`);
  });
});
