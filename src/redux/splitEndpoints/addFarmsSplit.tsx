import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from "src/utils/customFunctions";

export const apiWithAddFarms = splitApi.injectEndpoints({
  endpoints: (builder) => ({
    farmsAdd: builder.mutation<any, object>({
      query: (data) => (prepareAPIMutation(api.baseUrl, api.farmsUrl, '', 'POST', data, true)),
      invalidatesTags: ['FarmUsersList']
    }),
  }),
});

export const { useFarmsAddMutation } = apiWithAddFarms;
