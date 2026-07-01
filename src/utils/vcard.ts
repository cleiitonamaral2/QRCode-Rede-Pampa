import { Contact } from "../types";

/**
 * Splits a full name into a "LastName;FirstName" format for the N property of vCard.
 */
function parseNameForVCard(fullName: string): string {
  const trimmed = fullName.trim();
  const lastSpace = trimmed.lastIndexOf(" ");
  if (lastSpace === -1) {
    return trimmed + ";"; // Only one name word
  }
  const firstName = trimmed.substring(0, lastSpace);
  const lastName = trimmed.substring(lastSpace + 1);
  return `${lastName};${firstName}`;
}

/**
 * Generates an RFC-compliant vCard 3.0 string matching the exact format provided by the user.
 */
export function generateVCardString(contact: Contact): string {
  const nValue = parseNameForVCard(contact.name);
  const fnValue = contact.name.trim();
  const orgValue = (contact.company || "").trim();
  const titleValue = (contact.role || "").trim();
  
  // ADR format: ;;Street;City;State;ZIP;Country
  const street = (contact.street || "").trim();
  const city = (contact.city || "").trim();
  const state = (contact.state || "").trim();
  const zip = (contact.zip || "").trim();
  const country = (contact.country || "").trim();
  const adrValue = `;;${street};${city};${state};${zip};${country}`;

  const phoneValue = (contact.phone || "").trim();
  const mobileValue = (contact.mobile || "").trim();
  const faxValue = (contact.fax || "").trim();
  const emailValue = (contact.email || "").trim();
  
  let urlValue = (contact.website || "").trim();
  // Strip http:// or https:// for standard representation in requested URL field format if desired, or keep as is
  // The example had: www.redepampa.com.br
  urlValue = urlValue.replace(/^https?:\/\//i, "");

  const parts = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${nValue}`,
    `FN:${fnValue}`,
    `ORG:${orgValue}`,
    `TITLE:${titleValue}`,
    `ADR:${adrValue}`,
    `TEL;WORK;VOICE:${phoneValue}`,
    `TEL;CELL:${mobileValue}`,
    `TEL;FAX:${faxValue}`,
    `EMAIL;WORK;INTERNET:${emailValue}`,
    `URL:${urlValue}`,
    "END:VCARD"
  ];

  return parts.join("\r\n"); // Standard RFC line endings for vCards
}
