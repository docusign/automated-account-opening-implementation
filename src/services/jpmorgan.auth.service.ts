import { IReq, IRes } from '../utils/types';
import jwt from 'jsonwebtoken';
import env from '../env';
import axios from 'axios';
import fs from 'fs';
const crypto = require('crypto');

let cachedToken: string | null = null;
let tokenExpiry: number | null = null;

const buildClientAssertion = (): string => {
  const privateKey = fs.readFileSync(env.JPM_PRIVATE_KEY_PATH, 'utf8');
  const certificate = fs.readFileSync(env.JPM_CERT_PATH, 'utf8');

  // Compute SHA-256 thumbprint (base64url)
  const certDer = crypto
    .createHash('sha256')
    .update(
      crypto
        .createPublicKey(certificate)
        .export({ type: 'spki', format: 'der' })
    )
    .digest('base64url');

  const now = Math.floor(Date.now() / 1000);

  const payload = {
    iss: env.JPM_CLIENT_ID,
    sub: env.JPM_CLIENT_ID,
    aud: env.JPM_TOKEN_URL,
    jti: crypto.randomUUID(),
    iat: now,
    exp: now + 300 // 5 min
  };

  return jwt.sign(payload, privateKey, {
    algorithm: 'RS256',
    header: {
      alg: 'RS256',
      typ: 'JWT',
      'x5t#S256': certDer
    }
  });
};

const fetchAccessToken = async (): Promise<string> => {
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const clientAssertion = buildClientAssertion();

  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: env.JPM_CLIENT_ID,
    client_assertion_type:
      'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
    client_assertion: clientAssertion,
    scope: env.JPM_SCOPE // or remove if not required
  });

  const response = await axios.post(env.JPM_TOKEN_URL, body.toString(), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });

  const { access_token, expires_in } = response.data;

  cachedToken = access_token;
  tokenExpiry = Date.now() + (expires_in - 30) * 1000;

  return access_token;
};


export const generateAuthToken = async (req: IReq, res: IRes) => {
  try {
    const token = await fetchAccessToken();

    return res.json({
      access_token: token,
      token_type: 'Bearer'
    });
  } catch (error: any) {
    console.error(error.response?.data || error.message);

    return new Error();
  }
};
