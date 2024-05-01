import { api } from 'src/api/apiPaths';
import { prepareAPIMutation, prepareAPIQuery } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';


//Needs to be reimplemented once the api is provided
export const apiWithGetFarmStallionAnalytics = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getFarmStallionAnalytics: build.query<any, void>({
      // query: (obj: any) =>  prepareAPIQuery(api.baseUrl, api.farmsUrl + '/analytics', obj,true),
      query: (obj: any) =>  prepareAPIMutation(api.baseUrl, api.farmsUrl + '/analytics', obj, 'POST', '', true),
      keepUnusedDataFor: 0,
      providesTags: (result, error) => [{ type: 'Stallion Analytics' }],
    }),
  }),
});

export const { useGetFarmStallionAnalyticsQuery } = apiWithGetFarmStallionAnalytics;