import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIQuery } from "src/utils/customFunctions";

export const apiWithaddForFarmEmailValid = splitApi.injectEndpoints({
  endpoints: (build) => ({
    addForFarmEmailValid: build.query<any, any>({
      query: (data: any) => (prepareAPIQuery(api.baseUrl, api.farmEmailSubscriptionValidUrl, data)),
    }),
  }),
});

export const { useAddForFarmEmailValidQuery } = apiWithaddForFarmEmailValid;
