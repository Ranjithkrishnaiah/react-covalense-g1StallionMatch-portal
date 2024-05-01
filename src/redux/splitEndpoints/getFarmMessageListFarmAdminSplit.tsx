import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIQuery } from 'src/utils/customFunctions';

export const apiWithGetFarmMessageListFarmAdmin = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getFarmMessageListFarmAdmin: build.query<any, any>({
      query: (params) =>
        prepareAPIQuery(api.baseUrl, api.messagesUrl + api.farmForAdmin, params, true),
      keepUnusedDataFor: 0,
      providesTags: (result, error) => [{ type: 'MessageFarmListFarmAdmin' }],
    }),
  }),
});

export const { useGetFarmMessageListFarmAdminQuery } = apiWithGetFarmMessageListFarmAdmin;
