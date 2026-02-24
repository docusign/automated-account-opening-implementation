import { IRes } from '../utils/types';
import axios from 'axios';
import env from '../env';

let cachedToken: string | null = null;
let tokenExpiry: number | null = null;

const fetchAccessToken = async (): Promise<string> => {
  // Return cached token if still valid
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const body = new URLSearchParams({
    client_id: env.JPM_CLIENT_ID as string,
    client_secret: env.JWT_SECRET_KEY as string,
    grant_type: 'client_credentials',
    scope: 'jpm:payments:sandbox'
  });

  const response = await axios.post(
    env.JPM_AUTH_URL,
    body.toString(),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
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
