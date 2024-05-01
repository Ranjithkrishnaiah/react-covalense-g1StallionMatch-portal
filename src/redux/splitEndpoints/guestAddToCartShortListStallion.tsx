import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from "src/utils/customFunctions";

export const guestAddToCartShortListStallion = splitApi.injectEndpoints({
  endpoints: (build) => ({
    guestAddToShortListStallion: build.mutation<any, any>({
      query: (productDetails) => (
        prepareAPIMutation(api.baseUrl, api.guestAddToCartShortListStallionUrl, '', 'POST', productDetails, true)
        ),
        invalidatesTags: ['CartItems']
    }),
  }),
});

export const { useGuestAddToShortListStallionMutation } = guestAddToCartShortListStallion;
