import { IRes } from '../utils/types';
import axios from 'axios';
import env from '../env';
import { generateAuthToken } from './jpmorgan.auth.service'; // adjust path if needed
import { AccountValidationData, IndividualValidationData } from 'src/models/accountValidationData';

export const validateEntity = async (validationData: IndividualValidationData, res: IRes) => {
  try {
    const accessToken = await generateAuthToken(res);

    const individualRequest = {
      requestId: validationData.requestId,

      entity: {
        individual: {
          firstName: validationData.firstName,
          lastName: validationData.lastName,
          middleName: validationData.middleName,
          additionalLastName: validationData.additionalLastName,
          namePrefix: validationData.namePrefix,
          nameSuffix: validationData.nameSuffix,
          fullName: validationData.fullName,

          gender: validationData.gender,
          dateOfBirth: validationData.dateOfBirth,

          postalAddress: {
            addressLine: validationData.addressLine,
            unitNumber: validationData.unitNumber,
            buildingNumber: validationData.buildingNumber,
            buildingName: validationData.buildingName,
            streetName: validationData.streetName,
            streetType: validationData.streetType,
            suburb: validationData.suburb,
            townName: validationData.townName,
            countrySubDvsn: validationData.countrySubDvsn,
            country: validationData.country,
            postalCode: validationData.postalCode,
            county: validationData.county,
            residentialStatus: validationData.residentialStatus
          },

          contactDetails: {
            phoneNumbers: validationData.phoneNumbers?.map(phone => ({
              phoneNumber: phone.phoneNumber,
              phoneNumberType: phone.phoneNumberType
            })),
            email: validationData.email
          },

          identification: validationData.identification?.map(id => ({
            idType: id.idType,
            id: id.id,
            issuer: id.issuer,
            issueDate: id.issueDate,
            expirationDate: id.expirationDate
          }))
        }
      }
    };

    const response = await axios.post(
      `${env.JPM_REQUEST_URL}/v2/validations/entity`,
      individualRequest,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      }
    );

    return res.status(200).json(response.data);

  } catch (error: any) {
    console.error(
      error.response?.data || error.message || 'Entity validation failed'
    );

    return res.status(500).json({
      error: 'Entity validation failed',
      details: error.response?.data || error.message
    });
  }
};

export const validateAccount = async (validationData: AccountValidationData, res: IRes) => {
  try {
    const accessToken = await generateAuthToken(res);

    const accountValidationRequest = {
      requestId: validationData.requestId,
      profileName: "globalaccountvalidation",

      account: {
        accountNumber: validationData.accountNumber,
        financialInstitutionId: {
          clearingSystemId: {
            id: validationData.clearingSystemId,
            idType: validationData.clearingSystemIdType
          },
          postalAddress: {
            country: validationData.country,
          }
        },
        accountNumberType: validationData.accountNumberType
      },

      entity: {
        individual: {
          firstName: validationData.firstName,
          lastName: validationData.lastName,
        }
      }
    };

    const response = await axios.post(
      `${env.JPM_REQUEST_URL}/v2/validations/accounts`,
      accountValidationRequest,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      }
    );

    return res.status(200).json(response.data);

  } catch (error: any) {
    console.error(
      error.response?.data || error.message || 'Account validation failed'
    );

    return res.status(500).json({
      error: 'Account validation failed',
      details: error.response?.data || error.message
    });
  }
};
