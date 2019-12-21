const { AAD_AUTH_ENDPOINT, AAD_TOKEN_ENDPOINT, STATE, OUTBOUNDAAD_CLIENT_ID, OUTBOUNDAAD_CLIENT_SECRET, OUTBOUNDAAD_SCOPES, OUTBOUNDAAD_REDIRECT_URI } = process.env;

exports.aad = {
  authEndpoint: AAD_AUTH_ENDPOINT,
  tokenEndpoint: AAD_TOKEN_ENDPOINT,
  state: STATE
};

exports.outboundAAD = {

  // Required, the client ID of your app in AAD
  clientID: OUTBOUNDAAD_CLIENT_ID,

  // Required if `responseType` is 'code', 'id_token code' or 'code id_token'.
  // If app key contains '\', replace it with '\\'.
  clientSecret: OUTBOUNDAAD_CLIENT_SECRET,

  scopes: OUTBOUNDAAD_SCOPES,

  redirectUri: OUTBOUNDAAD_REDIRECT_URI
};

