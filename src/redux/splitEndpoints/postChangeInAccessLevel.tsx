import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from "src/utils/customFunctions";

export const changeAccessLevel = splitApi.injectEndpoints({
  endpoints: (build) => ({
    accessLevel : build.mutation<any, any>({
      query: (data: any) => (prepareAPIMutation(api.baseUrl, api.changeAccessLevelUrl, '', 'PATCH', data,true)),
      invalidatesTags: ['InviteUsers Table'],
    }),
  }),
});

export const { useAccessLevelMutation } = changeAccessLevel;