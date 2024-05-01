export type StallionShortlist = {
    id: number;
    stallionId: string;
    url: string;
    image: string;
    yearToStud: number;
    yearToRetired: number;
    isPromoted: boolean;
    overview: string;
    horseName: string;
    yob: number;
    colourName: string;
    farmName: string;
    currencyCode: string;
    currencySymbol: string;
    fee: number;
    feeYear: number;
    countryName: string;
    stateName: string;
    data:any;
    meta: any;
    countryCode: string;
  };

  export type FeeRangeProps = {
    price: any;
    value: number | number[];
    setPrice: string | any;
    query: any;
  }
  
  export type HeaderProps = {
   setsearchKey: string | any;
    query: any;
  }