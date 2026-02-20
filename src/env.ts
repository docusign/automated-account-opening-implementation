/**
/**
 * Environments variables declared here.
 */

/* eslint-disable node/no-process-env */

const { 
  NODE_ENV,
  PORT,
  OAUTH_CLIENT_ID,
  OAUTH_CLIENT_SECRET,
  AUTHORIZATION_CODE,
  JWT_SECRET_KEY,
  JPM_PRIVATE_KEY_PATH,
  JPM_CERT_PATH,
  JPM_CLIENT_ID,
  JPM_TOKEN_URL,
  JPM_SCOPE
} = process.env;

if (!NODE_ENV) {
  throw new Error('NODE_ENV not set');
}

if (!PORT) {
  throw new Error('PORT not set');
}

if (!JPM_PRIVATE_KEY_PATH) {
  throw new Error('JPM_PRIVATE_KEY_PATH not set');
}

if (!JPM_CERT_PATH) {
  throw new Error('JPM_CERT_PATH not set');
}

if (!JPM_CLIENT_ID) {
  throw new Error('JPM_CLIENT_ID not set');
}

if (!JPM_TOKEN_URL) {
  throw new Error('JPM_TOKEN_URL not set');
}

if (!JPM_SCOPE) {
  throw new Error('JPM_SCOPE not set');
} 

if (!OAUTH_CLIENT_ID) {
  throw new Error('OAUTH_CLIENT_ID not set');
}

if (!OAUTH_CLIENT_SECRET) {
  throw new Error('OAUTH_CLIENT_SECRET not set');
}

if (!AUTHORIZATION_CODE) {
  throw new Error('AUTHORIZATION_CODE not set');
}

if (!JWT_SECRET_KEY) {
  throw new Error('JWT_SECRET_KEY not set');
}

export default {
  NODE_ENV,
  PORT,
  OAUTH_CLIENT_ID,
  OAUTH_CLIENT_SECRET,
  AUTHORIZATION_CODE,
  JWT_SECRET_KEY,
  JPM_PRIVATE_KEY_PATH,
  JPM_CERT_PATH,
  JPM_CLIENT_ID,
  JPM_TOKEN_URL,
  JPM_SCOPE
};
