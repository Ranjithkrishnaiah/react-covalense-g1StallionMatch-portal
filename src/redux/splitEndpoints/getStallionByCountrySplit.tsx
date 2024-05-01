import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIQuery } from "src/utils/customFunctions";

export type QueryParams = {
  order: string;
  sex: number;
  countryId: number;
  horseName: string;
}

export const apiWithGetStallionByCountry = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getStallionByCountry: build.query<any, void>({
      // query: (params: any) => (prepareAPIQuery(api.baseUrl, api.getStallionsByCountryAndName, params, true)),
      query: (params: any) => (
        prepareAPIQuery(api.baseUrl, api.getStallionsByCountryAndName, params, true)
      ), 
      providesTags: (result, error) => [{ type: 'getStallionByCountry' }],
    }),
    getKeyAncestors: build.query<any, any>({query: (params: any) => (
        prepareAPIQuery(api.baseUrl, api.getStallionsByCountryAndName, params)
      ), 
      providesTags: (result, error) => [{ type: 'getStallionByCountry' }],
    }),
  }),
});

export const { useGetStallionByCountryQuery, useGetKeyAncestorsQuery } = apiWithGetStallionByCountry;
