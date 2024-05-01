import { Countries } from 'src/@types/countries';
import { api } from '../../api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIQuery } from "src/utils/customFunctions";

export const apiWithCountry = splitApi.injectEndpoints({
  endpoints: (build) => ({
    countries: build.query<Countries[], void>({
      query: (data) => (prepareAPIQuery(api.baseUrl, api.countriesUrl, data)),
      keepUnusedDataFor: 60*60*24*365, //Keeps country data valid for an year
      providesTags: (result, error) => [{ type: 'Country' }],
    }),
    countriesForFooter: build.query<any, void>({
      query: (data) => (prepareAPIQuery(api.baseUrl, api.countriesUrl+'/for-footer', data)),
      providesTags: (result, error) => [{ type: 'Country' }],
    }),
  }),
});

export const cObj = apiWithCountry;
export const { useCountriesQuery,useCountriesForFooterQuery } = apiWithCountry;
