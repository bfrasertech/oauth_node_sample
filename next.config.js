/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-var-requires */

require('dotenv').config();

const path = require('path');
const Dotenv = require('dotenv-webpack');
const env = process.env.NODE_ENV ? `.${process.env.NODE_ENV}` : '';

module.exports = {
  webpack: config => {
    config.plugins = config.plugins || [];

    config.plugins = [
      ...config.plugins,

      new Dotenv({
        path: path.join(__dirname, `.env${env}`).trim(),
        systemvars: true,
      }),
    ];

    return config;
  },
};
