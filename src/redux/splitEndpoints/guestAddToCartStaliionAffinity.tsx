import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from "src/utils/customFunctions";

export const guestAddToCartStaliionAffinity = splitApi.injectEndpoints({
  endpoints: (build) => ({
    guestAddToCartStaliionAffinity: build.mutation<any, any>({
      query: (productDetails) => (
        prepareAPIMutation(api.baseUrl, api.guestAddToCartStaliionAffinityUrl, '', 'POST', productDetails, true)
        ),
        invalidatesTags: ['CartItems']
    }),
  }),
});

export const { useGuestAddToCartStaliionAffinityMutation } = guestAddToCartStaliionAffinity;
