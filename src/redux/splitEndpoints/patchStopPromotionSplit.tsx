import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from "src/utils/customFunctions";

export const apiWithpatchStopPromotion = splitApi.injectEndpoints({
  endpoints: (builder) => ({
    patchStopPromotion: builder.mutation<any, any>({
      // query:(data : any) => prepareAPIMutation(api.baseUrl, api.stallionPromotion + '/'+ data?.promotionId+'/stop-promotion-byid', '', 'PATCH', data?.dataApi, true),
      query:(data : any) => prepareAPIMutation(api.baseUrl, api.stopStallionPromotion , '', 'PATCH', data?.dataApi, true),
      invalidatesTags: ['stallionRoster']
    }),
    patchStopPromotionManually: builder.mutation<any, any>({
      // query:(data : any) => prepareAPIMutation(api.baseUrl, api.stallionPromotion + '/'+ data?.promotionId+'/stop-promotion-byid', '', 'PATCH', data?.dataApi, true),
      query:(data : any) => prepareAPIMutation(api.baseUrl, api.stopStallionPromotionManually , '', 'PATCH', data?.dataApi, true),
      invalidatesTags: ['stallionRoster']
    }),
  }),
});

export const { usePatchStopPromotionMutation,usePatchStopPromotionManuallyMutation } = apiWithpatchStopPromotion;