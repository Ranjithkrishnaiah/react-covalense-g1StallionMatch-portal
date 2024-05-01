import { api } from 'src/api/apiPaths';
import { prepareAPIQuery } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';


//Needs to be reimplemented once the api is provided
export const apiWithGetLocationData = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getLocationData: build.query<any, void>({
      query: (params : any) =>  (prepareAPIQuery('https://api.geonames.org/countryCodeJSON','', params)),
      keepUnusedDataFor: 0,
    }),
  }),
});

export const { useGetLocationDataQuery } = apiWithGetLocationData;