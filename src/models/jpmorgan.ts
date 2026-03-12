export interface Verifiable {
    verified?: boolean;
}

export interface PostalAddress {
    addressLine?: string[];
    townName?: string;
    countrySubDvsn?: string;
    country: string;
    postalCode?: string;
    county?: string;
    residentialStatus?: string;
    unitNumber?: string;
    buildingNumber?: string;
    buildingName?: string;
    streetType?: string;
    streetName?: string;
    suburb?: string;
}

export interface Identification {
    idType: string;
    id: string;
    issuer?: string;
    issueDate?: string;
    expirationDate?: string;
}

export interface PhoneNumber {
    phoneNumber?: string;
    phoneNumberType?: string;
}

export interface ContactDetails {
    email?: string;
    phoneNumbers?: PhoneNumber[];
}

export interface Income {
    income?: string;
    incomeCurrency?: string;
}

export interface Individual {
    firstName: string;
    lastName: string;
    middleName?: string;
    additionalLastName?: string;
    namePrefix?: string;
    nameSuffix?: string;
    fullName: string;
    associatedCountries?: string[];
    gender?: string;
    dateOfBirth?: number;
    postalAddress?: PostalAddress;
    identification?: Identification[];
    contactDetails?: ContactDetails;
    income?: Income;
}

export interface Entity extends Verifiable {
    individual: Individual;
}

export interface ClearingSystemId {
    id: string;
    idType: string;
}

export interface FincancialInstitutionId {
    postalAddress?: PostalAddress;
    clearingSystemId: ClearingSystemId;
}

export interface Account extends Verifiable {
    accountNumber: string;
    accountType?: string;
    financialInstitutionId: FincancialInstitutionId;
}

export interface EntityValidationRequestBody extends Entity {
    profileName?: string;
    requestId: string;
}

export interface AccountValidationRequestBody extends Account {
    profileName?: string;
    requestId: string;
}
