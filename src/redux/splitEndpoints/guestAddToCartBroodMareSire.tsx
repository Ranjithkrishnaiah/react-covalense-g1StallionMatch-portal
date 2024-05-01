import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from "src/utils/customFunctions";

export const guestAddToCartBroodMareSire = splitApi.injectEndpoints({
  endpoints: (build) => ({
    guestAddToCartBroodMareSire: build.mutation<any, any>({
      query: (productDetails) => (
        prepareAPIMutation(api.baseUrl, api.guestAddToCartBroodMareSireUrl, '', 'POST', productDetails, true)
        ),
        invalidatesTags: ['CartItems']
    }),
  }),
});

export const { useGuestAddToCartBroodMareSireMutation } = guestAddToCartBroodMareSire;
