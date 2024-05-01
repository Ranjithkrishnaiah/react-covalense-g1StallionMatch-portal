import { States } from 'src/@types/states';
import { splitApi } from '../rootMiddleware';
import { prepareAPIQuery } from "src/utils/customFunctions";
import { api } from 'src/api/apiPaths';

export const apiWithAllStates = splitApi.injectEndpoints({
  endpoints: (build) => ({
    allStates: build.query<any, void>({
      // query: () => (
      //   prepareAPIQuery(api.baseUrl, api.countriesStateslist, '')
      //   ),
    // keepUnusedDataFor: 60 * 60 * 24 * 365, //Keeps country data valid for an year
      query: () => (prepareAPIQuery(api.baseUrl, api.countriesStateslist, '')),
      keepUnusedDataFor: 0, 
      providesTags: (result, error) => [{ type: 'AllStates' }],
    }),
  }),
});

export const { useAllStatesQuery } = apiWithAllStates;
