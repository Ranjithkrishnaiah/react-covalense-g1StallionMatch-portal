export interface RegistrationFunction {
    (close: any, changeTitleTo: any, title: any): JSX.Element
}

//TO DO: Need to add conditional types to FarmName, FarmCountry etc based on "addFarm"
export interface RegisterSchema {
    fullName: string;
    countryId: number;
    email: string;
    addFarm?: boolean;
    acceptTerms?: boolean;
    farmName?: string,
    farmCountryId?: number,
    farmStateId?: number,
    farmWebsiteUrl?: string,
    password: string;
    confirmPassword?: string;
    hashKey?: string;
    postal_code?: string;
}

export interface RegisterObject {
    fullName: string;
    countryId: number;
    email: string;
    farmName?: string,
    farmCountryId?: number,
    farmStateId?: number,
    farmWebsiteUrl?: string,
    // postcode?: string,
    password: string;
}

export interface InvitedUserObject {
    countryId: number;
    password: string;
    hashKey: string;
    // postcode: any;
}

export interface RegisterDetails {
    finalBody: RegisterObject  | InvitedUserObject,
    postUrl: string
}

export interface AuthResponse {
    data:{
        token: string;
        user: object;
    },
    error?: Record<string, any>;
}