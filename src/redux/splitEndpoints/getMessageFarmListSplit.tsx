import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIQuery } from 'src/utils/customFunctions';

export const apiWithGetMessageFarmList = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getMessageFarmList: build.query<any, any>({
      query: (params) => prepareAPIQuery(api.baseUrl, api.messagesUrl, params, true),
      keepUnusedDataFor: 0,
      providesTags: (result, error) => [{ type: 'MessageFarmList' }],
    }),
  }),
});

export const { useGetMessageFarmListQuery } = apiWithGetMessageFarmList;
