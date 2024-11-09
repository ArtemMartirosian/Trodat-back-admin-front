export type ContactAddress = {
    address: string;
    geolocation?: string; // Optional geolocation information
};

export type SocialMedia = {
    name: string;  // Name of the social media platform (e.g., Facebook, Twitter)
    link: string;  // URL to the social media profile
};

export type ContactType = {
    id: string;                // Unique identifier for the contact
    name: string;              // Name of the contact
    emails: string[];          // Array of email addresses
    phones: string[];          // Array of phone numbers
    addresses: ContactAddress[]; // Array of addresses with optional geolocation
    socialMedia: SocialMedia[];  // Array of social media profiles
};
