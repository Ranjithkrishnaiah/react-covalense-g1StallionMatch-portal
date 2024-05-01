export const initialState: State = {
    stallionName: "", 
    searchKey: "",
    sortBy: 'Promoted',
    location: "",
    farms: [],
    yearToStud: [],
    colour: [],
    currency: 1,
    priceRange: [0,0],
    isPrivateFee: true,
    isExcludeKeyAncestor: false,
    sire:[],
    damSire: [],
    keyAncestor: [],
    limit: 12,
    page: 1,
}
type State =  {
    page: number;
    priceRange: number[];
    stallionName: any;
    sortBy: any;
    farms: any[];
    yearToStud: any[];
    colour: any;
    currency: any; 
    searchKey: any;
    location: any;
    isPrivateFee: boolean;
    isExcludeKeyAncestor: boolean;
    sire: any[];
    damSire: any[];
    keyAncestor: any[];
    limit: number;
}