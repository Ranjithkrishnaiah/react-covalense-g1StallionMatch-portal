import { api } from 'src/api/apiPaths';
import { prepareAPIQuery } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';
export const GetFarmsMedia = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getFarmsMedia: build.query<any, void>({
      query: () => (prepareAPIQuery(api.baseUrl, api.userFarmMediaUrl, '', true)),
      keepUnusedDataFor: 0,
      providesTags: (result, error) => [{ type: 'Farm Media' }],
    }),
  }),
});

export const { useGetFarmsMediaQuery } = GetFarmsMedia;