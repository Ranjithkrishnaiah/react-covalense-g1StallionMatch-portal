import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from "src/utils/customFunctions";

export const apiWithstopStallionPromotion = splitApi.injectEndpoints({
  endpoints: (builder) => ({
    stopStallionPromotion: builder.mutation<any, any>({
      query:(data : any) => prepareAPIMutation(api.baseUrl, api.stopStallionPromotion + '/'+ data?.stallionId, '', 'POST', data?.dataApi, true),
      invalidatesTags: ['stallionRoster']
    }),
  }),
});

export const { useStopStallionPromotionMutation } = apiWithstopStallionPromotion;