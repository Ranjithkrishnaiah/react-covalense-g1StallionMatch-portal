import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from "src/utils/customFunctions";

export const guestAddToCartMatchPro = splitApi.injectEndpoints({
  endpoints: (build) => ({
    guestAddToCartMatchPro: build.mutation<any, any>({
      query: (productDetails) => (
        prepareAPIMutation(api.baseUrl, api.guestAddToCartMatchProUrl, '', 'POST', productDetails, true)
        ),
        invalidatesTags: ['CartItems']
    }),
  }),
});

export const { useGuestAddToCartMatchProMutation } = guestAddToCartMatchPro;
