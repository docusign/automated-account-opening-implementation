import { anyProvided, missingRequired, Schema } from "../mapping/schema";
import type { Entity } from "../models/jpmorgan";
import { t } from "../i18n";

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
    { kind: "exact", from: "firstName", to: "individual.firstName", required: true },
    { kind: "exact", from: "lastName", to: "individual.lastName", required: true },
    { kind: "exact", from: "fullName", to: "individual.fullName", required: true },

    { kind: "exact", from: "middleName", to: "individual.middleName" },
    { kind: "exact", from: "additionalLastName", to: "individual.additionalLastName" },
    { kind: "exact", from: "namePrefix", to: "individual.namePrefix" },
    { kind: "exact", from: "nameSuffix", to: "individual.nameSuffix" },

    { kind: "exact", from: "gender", to: "individual.gender" },
    { kind: "exact", from: "dateOfBirth", to: "individual.dateOfBirth" },

    { kind: "exact", from: "associatedCountries", to: "individual.associatedCountries", map: strArr(",") },

    // Postal address
    { kind: "exact", from: "country", to: "individual.postalAddress.country", required: true },

    { kind: "exact", from: "townName", to: "individual.postalAddress.townName" },
    { kind: "exact", from: "countrySubDvsn", to: "individual.postalAddress.countrySubDvsn" },
    { kind: "exact", from: "postalCode", to: "individual.postalAddress.postalCode" },
    { kind: "exact", from: "county", to: "individual.postalAddress.county" },
    { kind: "exact", from: "residentialStatus", to: "individual.postalAddress.residentialStatus" },
    { kind: "exact", from: "unitNumber", to: "individual.postalAddress.unitNumber" },
    { kind: "exact", from: "buildingNumber", to: "individual.postalAddress.buildingNumber" },
    { kind: "exact", from: "buildingName", to: "individual.postalAddress.buildingName" },
    { kind: "exact", from: "streetType", to: "individual.postalAddress.streetType" },
    { kind: "exact", from: "streetName", to: "individual.postalAddress.streetName" },
    { kind: "exact", from: "suburb", to: "individual.postalAddress.suburb" },
    { kind: "exact", from: "addressLine", to: "individual.postalAddress.addressLine", map: strArr(",") },

    // Identification
    {
      kind: "exact",
      from: "idType",
      to: "individual.identification[0].idType",
    },
    {
      kind: "exact",
      from: "id",
      to: "individual.identification[0].id",
    },
    {
      kind: "exact",
      from: "issuer",
      to: "individual.identification[0].issuer",
    },
    {
      kind: "exact",
      from: "issueDate",
      to: "individual.identification[0].issueDate",
    },
    {
      kind: "exact",
      from: "expirationDate",
      to: "individual.identification[0].expirationDate",
    },

    // Contact details
    { kind: "exact", from: "email", to: "individual.contactDetails.email" },

    // Phone numbers
    {
      kind: "exact",
      from: "phoneNumber",
      to: "individual.contactDetails.phoneNumbers[0].phoneNumber",
    },
    {
      kind: "exact",
      from: "phoneNumberType",
      to: "individual.contactDetails.phoneNumbers[0].phoneNumberType",
    },

    // Income
    { kind: "exact", from: "income", to: "individual.income.income" },
    { kind: "exact", from: "incomeCurrency", to: "individual.income.incomeCurrency" },
  ],
  validate: (_out, src) => {
    const errs: string[] = [];

    // Postal address: optional group, but requires country if any postal field is provided
    if (anyProvided(src, POSTAL_GROUP_KEYS)) {
      const missing = missingRequired(src, POSTAL_REQUIRED_WHEN_PRESENT);
      for (const k of missing) {
        errs.push(t("POSTAL_ADDRESS_NOT_FULL") + k);
      }
    }

    // Identification: optional group, but requires idType + id if any identification field is provided
    if (anyProvided(src, IDENT_GROUP_KEYS)) {
      const missing = missingRequired(src, IDENT_REQUIRED_WHEN_PRESENT);
      for (const k of missing) {
        errs.push(t("ID_NOT_FULL") + k);
      }
    }

    // Optional example: phoneNumbers group rules
    if (anyProvided(src, PHONE_GROUP_KEYS)) {
      const missing = missingRequired(src, PHONE_REQUIRED_WHEN_PRESENT);
      for (const k of missing) {
        errs.push(t("PHONE_NUMBER_NOT_FULL") + k);
      }
    }

    return errs;
  },
};