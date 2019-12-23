const {
  AAD_AUTH_ENDPOINT,
  AAD_TOKEN_ENDPOINT,
  STATE,
  AAD_OPEN_ID_CONFIG,
  OUTBOUNDAAD_CLIENT_ID,
  OUTBOUNDAAD_CLIENT_SECRET,
  OUTBOUNDAAD_SCOPES,
  OUTBOUNDAAD_REDIRECT_URI,
  INBOUNDAAD_CLIENT_ID,
  INBOUNDAAD_CLIENT_SECRET,
  INBOUNDAAD_SCOPES,
  INBOUNDAAD_REDIRECT_URI,
} = process.env;

exports.aad = {
  authEndpoint: AAD_AUTH_ENDPOINT,
  tokenEndpoint: AAD_TOKEN_ENDPOINT,
  state: STATE,
  openIDConfigEndpoint: AAD_OPEN_ID_CONFIG,
};

exports.outboundAAD = {
  // Required, the client ID of your app in AAD
  clientID: OUTBOUNDAAD_CLIENT_ID,

  // Required if `responseType` is 'code', 'id_token code' or 'code id_token'.
  // If app key contains '\', replace it with '\\'.
  clientSecret: OUTBOUNDAAD_CLIENT_SECRET,

  scopes: OUTBOUNDAAD_SCOPES,

  redirectUri: OUTBOUNDAAD_REDIRECT_URI,
};

exports.inboundAAD = {
  clientID: INBOUNDAAD_CLIENT_ID,

  clientSecret: INBOUNDAAD_CLIENT_SECRET,

  scopes: INBOUNDAAD_SCOPES,

  redirectUri: INBOUNDAAD_REDIRECT_URI,
};
