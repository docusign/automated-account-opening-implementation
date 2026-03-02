import { IRes } from '../utils/types';
import axios from 'axios';
import env from '../env';
import { generateAuthToken } from './jpmorgan.auth.service'; // adjust path if needed
import { AccountValidationRequestBody, EntityValidationRequestBody } from '../models/jpmorgan';

export const validateEntity = async (validationData: EntityValidationRequestBody, res: IRes) => {
  try {
    const accessToken = await generateAuthToken(res);

    const response = await axios.post(
      `${env.JPM_REQUEST_URL}/v2/validations/entity`,
      validationData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      }
    );

    return response;

  } catch (error: any) {
    console.error(
      error.response?.data || error.message || 'Entity validation failed'
    );

    throw new Error(error.response?.data || error.message || 'Entity validation failed');
  }
};

export const validateAccount = async (validationData: AccountValidationRequestBody, res: IRes) => {
  try {
    const accessToken = await generateAuthToken(res);

    const response = await axios.post(
      `${env.JPM_REQUEST_URL}/v2/validations/accounts`,
      validationData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      }
    );

    return response;

  } catch (error: any) {
    console.error(
      error.response?.data || error.message || 'Account validation failed'
    );

    throw new Error(error.response?.data || error.message || 'Account validation failed');
  }
};
