import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from "src/utils/customFunctions";

export const apiWithaddStallionPromotion = splitApi.injectEndpoints({
  endpoints: (builder) => ({
    addStallionPromotion: builder.mutation<any, object>({
      query: (data) => 
      prepareAPIMutation(api.baseUrl, api.stallionPromotion, '', 'POST', data, true),
      invalidatesTags: ['stallionRoster']
    }),
  }),
});

export const { useAddStallionPromotionMutation } = apiWithaddStallionPromotion;