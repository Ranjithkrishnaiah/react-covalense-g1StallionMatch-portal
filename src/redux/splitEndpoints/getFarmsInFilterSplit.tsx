import { FavoriteList, FavoriteListByLocation } from 'src/@types/lists';
import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIQuery } from "src/utils/customFunctions";

export const apiWithGetFarmsInFilter = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getFarmsInFilter: build.query<FavoriteList, void>({
      query: () => (prepareAPIQuery(api.baseUrl, api.farmsInFilterUrl, '')),
      keepUnusedDataFor: 0,
      transformResponse: (farms: any, meta, arg) => {
        let transformedFarms: any[] = [];
        farms.map((farm: any) => {
          let { farmId: id, farmName: label } = farm;
          transformedFarms.push({ id, label });
        });
        return transformedFarms;
      },
      providesTags: (result, error) => [{ type: 'FarmsInFilter' }],
    }),
    getFarmsInFilterByLocation: build.query<FavoriteListByLocation[], any>({
      query: (param) => (prepareAPIQuery(api.baseUrl, api.farmsInFilterByLocUrl+param, '')),
      keepUnusedDataFor: 0,
      transformResponse: (farms: any, meta, arg) => {
        let transformedFarms: any[] = [];
        farms.map((farm: any) => {
          let { farmId: id, farmName: label } = farm;
          transformedFarms.push({ id, label });
        });
        return transformedFarms;
      },
      providesTags: (result, error) => [{ type: 'FarmsInFilter' }],
    }),
  }),
});

export const { useGetFarmsInFilterQuery, useGetFarmsInFilterByLocationQuery } = apiWithGetFarmsInFilter;
