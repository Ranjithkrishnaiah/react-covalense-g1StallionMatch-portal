import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation, prepareAPIQuery } from "src/utils/customFunctions";

export const closeAccountApi = splitApi.injectEndpoints({
  endpoints: (build) => ({
    closeAccount: build.query<any, any>({
      query: () => (prepareAPIQuery(api.baseUrl, api.closeAccountUrl, "", true)),
    }),
  }),
});

export const { 
  useCloseAccountQuery
} = closeAccountApi;
