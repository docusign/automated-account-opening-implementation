import {t} from './i18n';
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
  throw new Error(t("NODE_ENV_NOT_SET"));
}

if (!PORT) {
  throw new Error(t("PORT_NOT_SET"));
}

if (!JPM_SECRET_KEY) {
  throw new Error(t("JPM_SECRET_KEY_NOT_SET"));
}

if (!JPM_CLIENT_ID) {
  throw new Error(t("JPM_CLIENT_ID_NOT_SET"));
}

if (!JPM_REQUEST_URL) {
  throw new Error(t("JPM_REQUEST_URL_NOT_SET"));
}

if (!JPM_AUTH_URL) {
  throw new Error(t("JPM_AUTH_URL_NOT_SET"));
}

if (!OAUTH_CLIENT_ID) {
  throw new Error(t("OAUTH_CLIENT_ID_NOT_SET"));
}

if (!OAUTH_CLIENT_SECRET) {
  throw new Error(t("OAUTH_CLIENT_SECRET_NOT_SET"));
}

if (!AUTHORIZATION_CODE) {
  throw new Error(t("AUTHORIZATION_CODE_NOT_SET"));
}

if (!JWT_SECRET_KEY) {
  throw new Error(t("JWT_SECRET_KEY_NOT_SET"));
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
