import axios from 'axios';
import { fetchAccessToken } from './jpmorgan.auth.service'; // adjust path if needed
import { AccountValidationRequestBody, EntityValidationRequestBody } from '../models/jpmorgan';
import { t } from '../i18n';

const parseValidationError = (error: any) => {
  return error.response?.data?.context?.map((c: any) => `${c.message} in ${c.location}${c.field}`).join('. ');
}

export const validateEntity = async (validationData: EntityValidationRequestBody) => {
  try {
    await fetchAccessToken();

    const options = {
      method: 'POST',
      url: `${process.env.JPM_REQUEST_URL}/v2/validations/entities`,
      headers: {
        'x-client-id': process.env.JPM_CLIENT_ID,
        'x-program-id': 'COMPANYINDIVIDUAL',
        'x-program-id-type': 'AVS',
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      data: [validationData]
    }

    return await axios.request(options);
  } catch (error: any) {
    console.error(
      error.response?.data || error.message || t('ENTITY_VALIDATION_FAILED')
    );

    throw new Error(parseValidationError(error) || error.message || t('ENTITY_VALIDATION_FAILED'));
  }
};

export const validateAccount = async (validationData: AccountValidationRequestBody) => {
  try {
    await fetchAccessToken();

    const options = {
      method: 'POST',
      url: `${process.env.JPM_REQUEST_URL}/v2/validations/accounts`,
      data: [validationData],
      headers: {
        'x-client-id': process.env.JPM_CLIENT_ID,
        'x-program-id': 'VERIAUTH',
        'x-program-id-type': 'AVS',
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    };

    return await axios.request(options);
  } catch (error: any) {
    console.error(
      error.response?.data || error.message || t('ACCOUNT_VALIDATION_FAILED')
    );

    throw new Error(parseValidationError(error) || error.message || t('ACCOUNT_VALIDATION_FAILED'));
  }
};
