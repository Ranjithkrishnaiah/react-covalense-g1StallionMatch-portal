import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from "src/utils/customFunctions";


export const apiWithAddEmailSubscription = splitApi.injectEndpoints({
  endpoints: (builder) => ({
    addEmailSubscription: builder.mutation<any, object>({
      query: (data) => (
        prepareAPIMutation(api.baseUrl, api.emailSubscription, '', 'POST', data, true)
      ),
    }),
  }),
});

export const { useAddEmailSubscriptionMutation } = apiWithAddEmailSubscription;
