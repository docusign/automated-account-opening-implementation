export interface AccountValidationData {
  requestId: string;
  clearingSystemId: string;
  clearingSystemIdType: string;
  country: string;
  accountNumberType: string;
  lastName: string;
  firstName: string;
  accountNumber: string;
}

export interface IndividualValidationData {
  requestId: string;

  // Personal Info
  firstName: string;
  lastName: string;
  middleName?: string;
  additionalLastName?: string;
  namePrefix?: string;
  nameSuffix?: string;
  fullName?: string;

  gender?: string; // ex: "M" | "F" | "X"
  dateOfBirth?: number; // format: YYYYMMDD

  // Address
  addressLine?: string[]; 
  unitNumber?: string;
  buildingNumber?: string;
  buildingName?: string;
  streetName?: string;
  streetType?: string;
  suburb?: string;
  townName?: string;
  countrySubDvsn?: string;
  country?: string;
  postalCode?: string;
  county?: string;
  residentialStatus?: string;

  // Contact
  phoneNumbers?: PhoneNumber[];
  email?: string;

  // Identification
  identification?: Identification[];
}

export interface PhoneNumber {
  phoneNumber: string;
  phoneNumberType: string; // ex: "home" | "work" | "mobile"
}

export interface Identification {
  idType: string;
  id: string;
  issuer?: string;
  issueDate?: number; // format: YYYYMMDD
  expirationDate?: number; // format: YYYYMMDD
}