import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from "src/utils/customFunctions";

export const apiWithCreateAStallion = splitApi.injectEndpoints({
  endpoints: (builder) => ({
    stallionsCreate: builder.mutation<any, object>({
      query: (data) => (prepareAPIMutation(api.baseUrl, api.stallionsCreate, '', 'POST', data, true)),
    }),
  }),
});

export const { useStallionsCreateMutation } = apiWithCreateAStallion;
