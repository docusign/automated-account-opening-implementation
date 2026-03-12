import { Schema } from '../mapping/schema';
import type { Account } from '../models/jpmorgan';

export const accountSchema: Schema<Account> = {
  name: "Account",
  rules: [
    // Account
    { kind: "exact", from: "accountNumber", to: "account.accountNumber", required: true },
    { kind: "exact", from: "accountType", to: "account.accountType" },

    // Individual
    { kind: "exact", from: "firstName", to: "individual.firstName", required: true },
    { kind: "exact", from: "lastName", to: "individual.lastName", required: true },
    { kind: "exact", from: "fullName", to: "individual.fullName", required: true },

    // Financial Institution Id / Clearing System
    { kind: "exact", from: "clearingId", to: "account.financialInstitutionId.clearingSystemId.id", required: true },
    { kind: "exact", from: "clearingIdType", to: "account.financialInstitutionId.clearingSystemId.idType", required: true },

    // Postal address
    { kind: "exact", from: "country", to: "account.financialInstitutionId.postalAddress.country" },

    { kind: "exact", from: "townName", to: "account.financialInstitutionId.postalAddress.townName" },
    { kind: "exact", from: "countrySubDvsn", to: "account.financialInstitutionId.postalAddress.countrySubDvsn" },
    { kind: "exact", from: "postalCode", to: "account.financialInstitutionId.postalAddress.postalCode" },
    { kind: "exact", from: "county", to: "account.financialInstitutionId.postalAddress.county" },
    { kind: "exact", from: "unitNumber", to: "account.financialInstitutionId.postalAddress.unitNumber" },
    { kind: "exact", from: "buildingNumber", to: "account.financialInstitutionId.postalAddress.buildingNumber" },
    { kind: "exact", from: "buildingName", to: "account.financialInstitutionId.postalAddress.buildingName" },
    { kind: "exact", from: "streetType", to: "account.financialInstitutionId.postalAddress.streetType" },
    { kind: "exact", from: "streetName", to: "account.financialInstitutionId.postalAddress.streetName" },
    { kind: "exact", from: "suburb", to: "account.financialInstitutionId.postalAddress.suburb" },

    { kind: "exact", from: "addressLine", to: "account.financialInstitutionId.postalAddress.addressLine", map: (v) => v.split(",") },
  ],
};