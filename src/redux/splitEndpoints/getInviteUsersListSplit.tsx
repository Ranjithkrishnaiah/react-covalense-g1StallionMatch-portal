import { splitApi } from '../rootMiddleware';
import { prepareAPIQuery } from 'src/utils/customFunctions';
import { api } from 'src/api/apiPaths';

export const apiWithgetInviteUsersList = splitApi.injectEndpoints({
  endpoints: (builder) => ({
    getInviteUsersList: builder.query<any, any>({
      query: (params: any) =>
        prepareAPIQuery(api.baseUrl, params.Url, params.body, true),
      keepUnusedDataFor: 0,
      providesTags: () => [{ type: 'InviteUsers Table' }],
    }),
  }),
});

export const { useGetInviteUsersListQuery } = apiWithgetInviteUsersList;
