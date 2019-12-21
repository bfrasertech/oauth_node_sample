const express = require('express');
const fetch = require('isomorphic-unfetch');
const qs = require('qs');

const config = require('../config');

const router = express.Router();

router.get('/connect', function(req, res, next) {
  res.redirect(
    `${config.aad.authEndpoint}?state=${config.aad.state}&scope=${config.outboundAAD.scopes}&response_type=code&client_id=${config.outboundAAD.clientID}&redirect_uri=${config.outboundAAD.redirectUri}`
  );
});

router.get('/callback', async function(req, res, next) {

  const code = req.query['code'];
  const state = req.query['state'];

  const formData = {
    client_id: config.outboundAAD.clientID,
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: config.outboundAAD.redirectUri,
    client_secret: config.outboundAAD.clientSecret,
    aud: 'https://graph.microsoft.com/user.read'
  };

  if (state === config.aad.state) {
    const postData = qs.stringify(formData);

    const response = await fetch(config.aad.tokenEndpoint, {
      headers: {
        'accept': 'application/x-www-form-urlencoded;charset=utf-8',
        'content-type': 'application/x-www-form-urlencoded',
        'accept-encoding': 'utf-8'
      },
      method: 'post',
      body: postData,
    });

    const responseText = await response.text();
    const responseObject = JSON.parse(responseText);

    const graphResponse = await fetch('https://graph.microsoft.com/v1.0/me/', {
      headers: {
        'accept': 'application/json',
        'authorization': `Bearer ${responseObject.access_token}`,
      },
      method: 'get',
    }); 

    const graphResponseText = await graphResponse.text();
    const graphResponseObject = JSON.parse(graphResponseText);
    res.send(graphResponseObject.displayName);
  } else {
    res.send();
  }
});

module.exports = router;
