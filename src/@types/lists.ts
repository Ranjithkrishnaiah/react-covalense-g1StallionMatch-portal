export interface Favorite{
    horseId: string;
}

export interface FavoriteStallion{
    stallionId: string;
}

export interface FavoriteDamsire{
    horseId: string;
}

export interface MyFarm{
    farmId: string;
}

export interface FavoriteFarm{
    farmId: string;
}

export interface FarmUser{
    invitationId: number;
    farmId: string;
}

export interface List {
    id: string;
    name: string;
}

export interface FavoriteDamsireTable {
    data: any[];
    meta: Meta;
}
export interface FavoriteFarmTable {
    data: any[];
    meta: Meta;
}
export interface RecentSearchesOutput {
    stallionId: string;
    stallionName: string;
    mareId: string;
    mareName: string;
    createdOn: string;
    perfectMatch: number;
}

export interface FavoriteStallionList {
    id: string;
    name: string;
    src: string;
    RNRS: string;
    SW: string;
    "SW/RNRS%": string;
    data: any[];
    meta: Meta;
}
export type FavoriteList = List[];

export type Meta = {
    page: number;
    limit: number;
    itemCount: number;
    pageCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  }

export interface MyMares {
    id: string;
    name: string;
    data: any[];
    meta: Meta;
}

export type MyMaresList = MyMares[];

export interface StallionFarmList {
    id: string;
    name: string;
    countryId: number,
    stateId: number,
    stallionCount: number,    
    isStallionExist: number
}

export type FavoriteListByLocation = StallionFarmList[];