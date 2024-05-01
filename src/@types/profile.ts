export interface Name {
    fullName: string;
}
export interface Email {
    email: string;
}

export interface Address {
    address: string;
    countryId: string;
    postcode: string;
}

export interface NotificationSettings {
    messaging: boolean;
    stallionNomination: boolean;
    promotional: boolean;
    membership : boolean;
    newsAndUpdates: boolean;
    announcements : boolean;
}