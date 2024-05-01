import { FavoriteList } from 'src/@types/lists';
import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIQuery } from 'src/utils/customFunctions';

export const apiWithGetFarmsById = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getFarmById: build.query<any, string>({
      query: (farmId) => prepareAPIQuery(api.baseUrl, api.farmDetailsByIdUrl + '/' + farmId, ''),
      keepUnusedDataFor: 0,
      providesTags: (result, error) => [{ type: 'GetFarmById' }],
    }),

    getFarmCountryById: build.query<any, any>({
      query: (obj: any) =>
        prepareAPIQuery(
          api.baseUrl,
          api.farmDetailsByIdUrl + '/' + obj?.farmId,
          obj?.country ? '?countryName=' + obj?.country : ''
        ),
      keepUnusedDataFor: 0,
      providesTags: (result, error) => [{ type: 'GetFarmById' }],
    }),
  }),
});

export const { useGetFarmByIdQuery, useGetFarmCountryByIdQuery } = apiWithGetFarmsById;
