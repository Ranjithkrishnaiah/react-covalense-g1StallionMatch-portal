import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation, prepareAPIQuery } from "src/utils/customFunctions";

export const apiWithgetStallionAnalytics = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getStallionAnalytics: build.query<any, any>({
      query: (stallionId : any) => (prepareAPIQuery(api.baseUrl, api.stallionAnalytics +'/'+stallionId,'',true )),
      keepUnusedDataFor: 0,
    }),
    getStallionKeyStats: build.query<any, any>({
      query: (data : any) => (prepareAPIQuery(api.baseUrl, api.stallionKeyAnalytics , data, true )),
      keepUnusedDataFor: 0,
    }),
    getStallionCloseStats: build.query<any, any>({
      query: (data : any) => (prepareAPIQuery(api.baseUrl, api.stallionCloseAnalytics , data, true )),
      keepUnusedDataFor: 0,
    }),
    getStallionRoasterKeyStats: build.query<any, any>({
      query: (data : any) => (prepareAPIQuery(api.baseUrl, api.stallionKeyAnalyticsRoaster , data, true )),
      keepUnusedDataFor: 0,
    }),
    getStallionRoasterCloseStats: build.query<any, any>({
      query: (data : any) => (prepareAPIQuery(api.baseUrl, api.stallionCloseAnalyticsRoaster , data, true )),
      keepUnusedDataFor: 0,
    }),
    getStallionMatchedActivity: build.query<any, any>({
      query: (data : any) => (prepareAPIQuery(api.baseUrl, api.stallionMatchedActivity , data, true )),
      keepUnusedDataFor: 0,
      providesTags: (result, error) => [{ type: 'Stallion Match Activity' }],
    }),
  }),
});

export const { useGetStallionAnalyticsQuery,useGetStallionKeyStatsQuery,useGetStallionCloseStatsQuery,useGetStallionMatchedActivityQuery,useGetStallionRoasterCloseStatsQuery,useGetStallionRoasterKeyStatsQuery } = apiWithgetStallionAnalytics;
