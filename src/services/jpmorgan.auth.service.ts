import { IRes } from '../utils/types';
import axios from 'axios';

let cachedToken: string | null = null;
let tokenExpiry: number | null = null;

export const fetchAccessToken = async (): Promise<string> => {
  // Return cached token if still valid
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const data = new URLSearchParams({
    client_id: process.env.JPM_CLIENT_ID!,
    client_secret: process.env.JPM_SECRET_KEY!,
    grant_type: 'client_credentials',
    scope: 'jpm:payments:sandbox'
  }).toString();

  const response = await axios.post(
    process.env.JPM_AUTH_URL || 'https://id.payments.jpmorgan.com/am/oauth2/alpha/access_token',
    data,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      maxRedirects: 5,
    },
  );

  const { access_token, expires_in } = response.data;

  cachedToken = access_token;
  tokenExpiry = Date.now() + (expires_in - 30) * 1000;

  return access_token;
};

export const generateAuthToken = async (res: IRes) => {
  try {
    const token = await fetchAccessToken();

    return res.json({
      access_token: token,
      token_type: 'Bearer'
    });
  } catch (error: any) {
    console.error(error.response?.data || error.message);
    return res.status(500).json({
      error: 'Failed to retrieve access token'
    });
  }
};
