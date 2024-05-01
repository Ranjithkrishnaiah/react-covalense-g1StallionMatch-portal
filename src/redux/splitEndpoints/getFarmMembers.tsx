import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIQuery } from 'src/utils/customFunctions';

export const apiWithgetFarmMembers = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getFarmMembers: build.query<any, any>({
      query: (farmId: any) =>
        prepareAPIQuery(api.baseUrl, api.farmsUrl + '/' + farmId + '/members', '', true),
      keepUnusedDataFor: 0,
      providesTags: (result, error) => [{ type: 'FarmMembers' }],
    }),
  }),
});

export const { useGetFarmMembersQuery } = apiWithgetFarmMembers;
