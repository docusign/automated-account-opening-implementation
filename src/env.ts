/**
/**
 * Environments variables declared here.
 */

const { 
  NODE_ENV,
  PORT,
  OAUTH_CLIENT_ID,
  OAUTH_CLIENT_SECRET,
  AUTHORIZATION_CODE,
  JWT_SECRET_KEY,
  JPM_AUTH_URL,
  JPM_REQUEST_URL,
  JPM_CLIENT_ID,
  JPM_SECRET_KEY,
} = process.env;

if (!NODE_ENV) {
  throw new Error('NODE_ENV not set');
}

if (!PORT) {
  throw new Error('PORT not set');
}

if (!JPM_SECRET_KEY) {
  throw new Error('JPM_SECRET_KEY not set');
}

if (!JPM_CLIENT_ID) {
  throw new Error('JPM_CLIENT_ID not set');
}

if (!JPM_REQUEST_URL) {
  throw new Error('JPM_REQUEST_URL not set');
}

if (!JPM_AUTH_URL) {
  throw new Error('JPM_AUTH_URL not set');
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
  JPM_SECRET_KEY,
  JPM_AUTH_URL,
  JPM_CLIENT_ID, // yes
  JPM_REQUEST_URL,
};
