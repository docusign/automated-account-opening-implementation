import { anyProvided, missingRequired, Schema } from "../mapping/schema";
import type { Entity } from "../models/jpmorgan";

const strArr = (sep = ",") => (v: string) =>
  v.split(sep)
    .map(s => s.trim())
    .filter(Boolean);

const POSTAL_GROUP_KEYS = [
  "country",
  "townName",
  "countrySubDvsn",
  "postalCode",
  "county",
  "residentialStatus",
  "unitNumber",
  "buildingNumber",
  "buildingName",
  "streetType",
  "streetName",
  "suburb",
  "addressLine",
] as const;

const POSTAL_REQUIRED_WHEN_PRESENT = ["country"] as const;

const IDENT_GROUP_KEYS = [
  "idType",
  "id",
  "issuer",
  "issueDate",
  "expirationDate",
] as const;

const IDENT_REQUIRED_WHEN_PRESENT = ["idType", "id"] as const;

const PHONE_GROUP_KEYS = ["phoneNumber", "phoneNumberType"] as const;
const PHONE_REQUIRED_WHEN_PRESENT = ["phoneNumber"] as const;

export const entitySchema: Schema<Entity> = {
  name: "Entity",
  rules: [
    // Individual
    { kind: "exact", from: "firstName", to: "entity.individual.firstName", required: true },
    { kind: "exact", from: "lastName", to: "entity.individual.lastName", required: true },
    { kind: "exact", from: "fullName", to: "entity.individual.fullName", required: true },

    { kind: "exact", from: "middleName", to: "entity.individual.middleName" },
    { kind: "exact", from: "additionalLastName", to: "entity.individual.additionalLastName" },
    { kind: "exact", from: "namePrefix", to: "entity.individual.namePrefix" },
    { kind: "exact", from: "nameSuffix", to: "entity.individual.nameSuffix" },

    { kind: "exact", from: "gender", to: "entity.individual.gender" },
    { kind: "exact", from: "dateOfBirth", to: "entity.individual.dateOfBirth" },

    { kind: "exact", from: "associatedCountries", to: "entity.individual.associatedCountries", map: strArr(",") },

    // Postal address
    { kind: "exact", from: "country", to: "entity.individual.postalAddress.country", required: true },

    { kind: "exact", from: "townName", to: "entity.individual.postalAddress.townName" },
    { kind: "exact", from: "countrySubDvsn", to: "entity.individual.postalAddress.countrySubDvsn" },
    { kind: "exact", from: "postalCode", to: "entity.individual.postalAddress.postalCode" },
    { kind: "exact", from: "county", to: "entity.individual.postalAddress.county" },
    { kind: "exact", from: "residentialStatus", to: "entity.individual.postalAddress.residentialStatus" },
    { kind: "exact", from: "unitNumber", to: "entity.individual.postalAddress.unitNumber" },
    { kind: "exact", from: "buildingNumber", to: "entity.individual.postalAddress.buildingNumber" },
    { kind: "exact", from: "buildingName", to: "entity.individual.postalAddress.buildingName" },
    { kind: "exact", from: "streetType", to: "entity.individual.postalAddress.streetType" },
    { kind: "exact", from: "streetName", to: "entity.individual.postalAddress.streetName" },
    { kind: "exact", from: "suburb", to: "entity.individual.postalAddress.suburb" },
    { kind: "exact", from: "addressLine", to: "entity.individual.postalAddress.addressLine", map: strArr(",") },

    // Identification
    {
      kind: "exact",
      from: "idType",
      to: "entity.individual.identification[0].idType",
    },
    {
      kind: "exact",
      from: "id",
      to: "entity.individual.identification[0].id",
    },
    {
      kind: "exact",
      from: "issuer",
      to: "entity.individual.identification[0].issuer",
    },
    {
      kind: "exact",
      from: "issueDate",
      to: "entity.individual.identification[0].issueDate",
    },
    {
      kind: "exact",
      from: "expirationDate",
      to: "entity.individual.identification[0].expirationDate",
    },

    // Contact details
    { kind: "exact", from: "email", to: "entity.individual.contactDetails.email" },

    // Phone numbers
    {
      kind: "exact",
      from: "phoneNumber",
      to: "entity.individual.contactDetails.phoneNumbers[0].phoneNumber",
    },
    {
      kind: "exact",
      from: "phoneNumberType",
      to: "entity.individual.contactDetails.phoneNumbers[0].phoneNumberType",
    },

    // Income
    { kind: "exact", from: "income", to: "entity.individual.income.income" },
    { kind: "exact", from: "incomeCurrency", to: "entity.individual.income.incomeCurrency" },
  ],
  validate: (_out, src) => {
    const errs: string[] = [];

    // Postal address: optional group, but requires country if any postal field is provided
    if (anyProvided(src, POSTAL_GROUP_KEYS)) {
      const missing = missingRequired(src, POSTAL_REQUIRED_WHEN_PRESENT);
      for (const k of missing) {
        errs.push(`postalAddress provided but missing required field "${k}"`);
      }
    }

    // Identification: optional group, but requires idType + id if any identification field is provided
    if (anyProvided(src, IDENT_GROUP_KEYS)) {
      const missing = missingRequired(src, IDENT_REQUIRED_WHEN_PRESENT);
      for (const k of missing) {
        errs.push(`identification provided but missing required field "${k}"`);
      }
    }

    // Optional example: phoneNumbers group rules
    if (anyProvided(src, PHONE_GROUP_KEYS)) {
      const missing = missingRequired(src, PHONE_REQUIRED_WHEN_PRESENT);
      for (const k of missing) {
        errs.push(`phoneNumbers provided but missing required field "${k}"`);
      }
    }

    return errs;
  },
};