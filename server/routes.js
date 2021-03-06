const express = require('express');
const fetch = require('isomorphic-unfetch');
const qs = require('qs');
const jwt = require('jsonwebtoken');

const config = require('../config');

const router = express.Router();

getOpenIDConfig = async () => {
  const response = await fetch(config.aad.openIDConfigEndpoint, {
    headers: {
      accept: 'application/json',
    },
    method: 'get',
  });

  return await response.json();
};

getKeys = async keySetUri => {
  const response = await fetch(keySetUri, {
    headers: {
      accept: 'application/json',
    },
    method: 'get',
  });

  return await response.json();
};

// convertCertificate = (cert) => {
//   //Certificate must be in this specific format or else the function won't accept it
//   var beginCert = "-----BEGIN CERTIFICATE-----";
//   var endCert = "-----END CERTIFICATE-----";

//   cert = cert.replace("\n", "");
//   cert = cert.replace(beginCert, "");
//   cert = cert.replace(endCert, "");

//   var result = beginCert;
//   while (cert.length > 0) {

//       if (cert.length > 64) {
//           result += "\n" + cert.substring(0, 64);
//           cert = cert.substring(64, cert.length);
//       }
//       else {
//           result += "\n" + cert;
//           cert = "";
//       }
//   }

//   if (result[result.length ] != "\n")
//       result += "\n";
//   result += endCert + "\n";
//   return result;
// }

// simple endpoint to redirect to AAD to authorize our app
router.get('/connect', function(req, res, next) {
  res.redirect(
    `${config.aad.authEndpoint}?state=${config.aad.state}&scope=${config.outboundAAD.scopes}&response_type=code&client_id=${config.outboundAAD.clientID}&redirect_uri=${config.outboundAAD.redirectUri}`
  );
});

router.get('/inbound_connect', function(req, res, next) {
  res.redirect(
    `${config.aad.authEndpoint}?state=${config.aad.state}&scope=${config.inboundAAD.scopes}&response_type=code&client_id=${config.inboundAAD.clientID}&redirect_uri=${config.inboundAAD.redirectUri}`
  );
});

// endpoint that AAD calls back into with
router.get('/callback', async function(req, res, next) {
  const code = req.query['code'];
  const state = req.query['state'];

  const formData = {
    client_id: config.outboundAAD.clientID,
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: config.outboundAAD.redirectUri,
    client_secret: config.outboundAAD.clientSecret,
    aud: 'https://graph.microsoft.com/user.read',
  };

  if (state === config.aad.state) {
    const postData = qs.stringify(formData);

    const response = await fetch(config.aad.tokenEndpoint, {
      headers: {
        accept: 'application/x-www-form-urlencoded;charset=utf-8',
        'content-type': 'application/x-www-form-urlencoded',
        'accept-encoding': 'utf-8',
      },
      method: 'post',
      body: postData,
    });

    const responseText = await response.text();
    const responseObject = JSON.parse(responseText);

    const graphResponse = await fetch('https://graph.microsoft.com/v1.0/me/', {
      headers: {
        accept: 'application/json',
        authorization: `Bearer ${responseObject.access_token}`,
      },
      method: 'get',
    });

    const graphResponseText = await graphResponse.text();
    const graphResponseObject = JSON.parse(graphResponseText);

    res.send({
      displayName: graphResponseObject.displayName,
      email: graphResponseObject.mail,
      upn: graphResponseObject.userPrincipalName,
      oid: graphResponseObject.id,
    });
  } else {
    res.send();
  }
});

router.get('/inbound_callback', async function(req, res, next) {
  const code = req.query['code'];
  const state = req.query['state'];

  const formData = {
    client_id: config.inboundAAD.clientID,
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: config.inboundAAD.redirectUri,
    client_secret: config.inboundAAD.clientSecret,
    aud: 'api://751982b4-7adf-4033-8e92-f4b95b51f943/read',
  };

  if (state === config.aad.state) {
    const postData = qs.stringify(formData);

    const response = await fetch(config.aad.tokenEndpoint, {
      headers: {
        accept: 'application/x-www-form-urlencoded;charset=utf-8',
        'content-type': 'application/x-www-form-urlencoded',
        'accept-encoding': 'utf-8',
      },
      method: 'post',
      body: postData,
    });

    const responseText = await response.text();
    const responseObject = JSON.parse(responseText);

    const apiResponse = await fetch('http://localhost:3000/api/test', {
      headers: {
        accept: 'application/json',
        authorization: `Bearer ${responseObject.access_token}`,
      },
      method: 'get',
    });

    const apiResponseText = await apiResponse.text();
    const apiResponseObject = JSON.parse(apiResponseText);

    res.send({
      result: apiResponseObject.result,
    });
  } else {
    res.send();
  }
});

router.post('/api/test', async (req, res) => {
  const authToken = req.headers.authorization.split(' ')[1];

  // access the config endpoint to get the keys uri
  const openIdConfig = await getOpenIDConfig();

  // get the list of keys used to sign the jwt. use the kid value in the jwt header
  // to identify which key in this list was used
  const keys = await getKeys(openIdConfig.jwks_uri);

  keys.keys.forEach(function(key) {
    key.x5c.forEach(function(keyItem) {
      let secret = keyItem;

      try {
        // temporarily skipping verification. it currently fails but would most likely be handled by a library such as passport or msal
        // const cert = convertCertificate(secret);
        // const verified = jwt.verify(authToken, cert, { algorithms: ['RS256','RS384','RS512','ES256','ES384','ES512'] });
      } catch (err) {
        console.log(err);
      }
    });
  });

  const decodedJwt = jwt.decode(authToken);
  res.send({ result: `Congrats ${decodedJwt.upn} posted: ${req.body.data}` });
});

router.get('/api/test', async (req, res) => {
  const authToken = req.headers.authorization.split(' ')[1];

  // access the config endpoint to get the keys uri
  const openIdConfig = await getOpenIDConfig();

  // get the list of keys used to sign the jwt. use the kid value in the jwt header
  // to identify which key in this list was used
  const keys = await getKeys(openIdConfig.jwks_uri);

  keys.keys.forEach(function(key) {
    key.x5c.forEach(function(keyItem) {
      let secret = keyItem;

      try {
        // temporarily skipping verification. it currently fails but would most likely be handled by a library such as passport or msal
        // const cert = convertCertificate(secret);
        // const verified = jwt.verify(authToken, cert, { algorithms: ['RS256','RS384','RS512','ES256','ES384','ES512'] });
      } catch (err) {
        console.log(err);
      }
    });
  });

  const decodedJwt = jwt.decode(authToken);
  res.send({ result: `Congrats ${decodedJwt.upn} successfully called api` });
});

module.exports = router;
