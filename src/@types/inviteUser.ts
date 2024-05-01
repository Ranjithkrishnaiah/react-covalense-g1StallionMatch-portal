export type InviteUserSchema = {
    fullName: string;
    email: string;
    accessLevel: 'Full Access' | 'View Only' | '3rd Party' | 'none';
    isMember: boolean;
    farmName?:string;
    farmUuid?:string
}

export type CheckValidityInput = {
    hash: string;
}
export type InviteUserBody = {
    hashKey: string;
    countryId: number;
    password: string;
}