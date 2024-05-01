import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from "src/utils/customFunctions";

export const apiWithStallionsAdd = splitApi.injectEndpoints({
  endpoints: (builder) => ({
    stallionsAdd: builder.mutation<any, object>({
      query: (data) => (prepareAPIMutation(api.baseUrl, api.stallions, '', 'POST', data,true)),
      invalidatesTags: ['stallionRoster', 'Stallion Activity', 'Stallion Match Activity', 'Stallion Analytics']
    }),
  }),
});

export const { useStallionsAddMutation } = apiWithStallionsAdd;
