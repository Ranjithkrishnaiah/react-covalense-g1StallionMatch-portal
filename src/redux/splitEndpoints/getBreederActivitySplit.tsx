import { api } from 'src/api/apiPaths';
import { prepareAPIQuery } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';


//Needs to be reimplemented once the api is provided
export const apiWithgetBreederActivity = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getBreederActivity: build.query<any, void>({
      query: (params: any) => (prepareAPIQuery(api.baseUrl, api.activities + '/breeder', params, true)),
      keepUnusedDataFor: 0,
    }),
    breederReportWorldMap: build.query<any, any>({
      query: (params: any) => (prepareAPIQuery(api.baseUrl, api.breederMatchWorldMap, params, true)),
      keepUnusedDataFor: 0,
    }),
  }),
});

export const { useGetBreederActivityQuery, useBreederReportWorldMapQuery } = apiWithgetBreederActivity;