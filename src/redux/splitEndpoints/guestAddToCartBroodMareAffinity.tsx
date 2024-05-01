import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from "src/utils/customFunctions";

export const guestAddToCartBroodMareAffinity = splitApi.injectEndpoints({
  endpoints: (build) => ({
    guestAddToCartBroodMareAffinity: build.mutation<any, any>({
      query: (productDetails) => (
        prepareAPIMutation(api.baseUrl, api.guestAddToCartBroodMareAffinityUrl, '', 'POST', productDetails, true)
        ),
        invalidatesTags: ['CartItems']
    }),
  }),
});

export const { useGuestAddToCartBroodMareAffinityMutation } = guestAddToCartBroodMareAffinity;
