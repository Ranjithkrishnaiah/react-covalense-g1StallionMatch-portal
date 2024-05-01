import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from "src/utils/customFunctions";

export const apiWithpatchStallionPromotions = splitApi.injectEndpoints({
  endpoints: (builder) => ({
    patchStallionPromotions: builder.mutation<any, any>({
      query: (data) => 
      prepareAPIMutation(api.baseUrl, api.stallionPromotion, '', 'PATCH', data, true),
      invalidatesTags: ['stallionRoster']
    }),
  }),
});

export const { usePatchStallionPromotionsMutation } = apiWithpatchStallionPromotions;