// ----------------------------------------------------------------------

export type StallionList = {
  stallionId: string;
  horseName: string;
  yearToStud: number;
  farmName: string;
  fee: number;
  feeYear: number;
  image: string;
  data:any;
  result_set: any;
  meta: any;
  currency: number;
  currencyCode: string;
  currencySymbol: string;
  isPromoted: boolean;
  countryCode: string;
  isPrivateFee: boolean;
  yob: string;
  stateName: string;
  galleryImage: string;
  profilePic:string
};

export type FeeRangeProps = {
  price: any;
  setCurrency: any;
  value: number | number[];
  setPrice: string | any;
  query: any;
  clear: boolean;
  isPrivateFee: boolean;
  setClear: any;
}

export type HeaderProps = {
 setsearchKey: string | any;
  query: any;
}

export interface ProfileUpdateDetails {
  finalBody: any,
  postUrl: string,
  stallionId: string
}
