import { Contact } from "../types";

/**
 * Generates an RFC-compliant vCard 3.0 string based on the contact details.
 */
export function generateVCardString(contact: Contact): string {
  const parts = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${contact.name.trim()}`,
    `N:;${contact.name.trim()};;;`
  ];

  if (contact.company) {
    parts.push(`ORG:${contact.company.trim()}`);
  }

  if (contact.role) {
    parts.push(`TITLE:${contact.role.trim()}`);
  }

  if (contact.phone) {
    parts.push(`TEL;TYPE=WORK,VOICE:${contact.phone.trim()}`);
  }

  if (contact.mobile) {
    parts.push(`TEL;TYPE=CELL,VOICE:${contact.mobile.trim()}`);
  }

  if (contact.email) {
    parts.push(`EMAIL;TYPE=PREF,INTERNET:${contact.email.trim()}`);
  }

  if (contact.website) {
    let url = contact.website.trim();
    if (url && !/^https?:\/\//i.test(url)) {
      url = `https://${url}`;
    }
    parts.push(`URL:${url}`);
  }

  if (contact.address) {
    const escapedAddress = contact.address
      .replace(/\\/g, "\\\\")
      .replace(/;/g, "\\;")
      .replace(/,/g, "\\,")
      .replace(/\r?\n/g, " ");
    parts.push(`ADR;TYPE=WORK:;;${escapedAddress};;;;`);
  }

  parts.push("END:VCARD");

  return parts.join("\r\n"); // Standard RFC line endings for vCards
}
