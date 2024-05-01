import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIQuery } from "src/utils/customFunctions";

export const apiWithgetBreederAnalytics = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getBreederAnalytics: build.query<any, any>({
      query: (farmId : any) => (prepareAPIQuery(api.baseUrl, api.breederAnalytics +'/'+farmId,'',true )),
      keepUnusedDataFor: 0,
    }),
  }),
});

export const { useGetBreederAnalyticsQuery } = apiWithgetBreederAnalytics;
