import { Schema } from '../mapping/schema';
import type { Account } from '../models/jpmorgan';

export const accountSchema: Schema<Account> = {
  name: "Account",
  rules: [
    // Account
    { kind: "exact", from: "accountNumber", to: "accountNumber", required: true },
    { kind: "exact", from: "accountType", to: "accountType" },

    // Financial Institution Id / Clearing System
    { kind: "exact", from: "clearingId", to: "financialInstitutionId.clearingSystemId.id", required: true },
    { kind: "exact", from: "clearingIdType", to: "financialInstitutionId.clearingSystemId.idType", required: true },

    // Postal address
    { kind: "exact", from: "country", to: "financialInstitutionId.postalAddress.country" },

    { kind: "exact", from: "townName", to: "financialInstitutionId.postalAddress.townName" },
    { kind: "exact", from: "countrySubDvsn", to: "financialInstitutionId.postalAddress.countrySubDvsn" },
    { kind: "exact", from: "postalCode", to: "financialInstitutionId.postalAddress.postalCode" },
    { kind: "exact", from: "county", to: "financialInstitutionId.postalAddress.county" },
    { kind: "exact", from: "unitNumber", to: "financialInstitutionId.postalAddress.unitNumber" },
    { kind: "exact", from: "buildingNumber", to: "financialInstitutionId.postalAddress.buildingNumber" },
    { kind: "exact", from: "buildingName", to: "financialInstitutionId.postalAddress.buildingName" },
    { kind: "exact", from: "streetType", to: "financialInstitutionId.postalAddress.streetType" },
    { kind: "exact", from: "streetName", to: "financialInstitutionId.postalAddress.streetName" },
    { kind: "exact", from: "suburb", to: "financialInstitutionId.postalAddress.suburb" },

    { kind: "exact", from: "addressLine", to: "financialInstitutionId.postalAddress.addressLine", map: (v) => v.split(",") },
  ],
};