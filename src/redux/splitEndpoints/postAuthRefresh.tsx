import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from "src/utils/customFunctions";

type refreshToken = {
    refresh_token: string;
}
export const authRefresh = splitApi.injectEndpoints({
  endpoints: (builder) => ({
    postAuthRefresh: builder.mutation<any, refreshToken>({
      query: (data) => 
      prepareAPIMutation(api.baseUrl, api.authRefreshUrl, '', 'POST', data, true),
    }),
  }),
});

export const { usePostAuthRefreshMutation } = authRefresh;