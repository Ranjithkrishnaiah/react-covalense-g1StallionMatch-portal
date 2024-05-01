import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from "src/utils/customFunctions";


export const apiWithaddForFarmEmailSubscription = splitApi.injectEndpoints({
  endpoints: (builder) => ({
    addForFarmEmailSubscription: builder.mutation<any, object>({
      query: (data) => (
        prepareAPIMutation(api.baseUrl, api.farmEmailSubscriptionUrl, '', 'POST', data, true)
      ),
    }),
  }),
});

export const { useAddForFarmEmailSubscriptionMutation } = apiWithaddForFarmEmailSubscription;