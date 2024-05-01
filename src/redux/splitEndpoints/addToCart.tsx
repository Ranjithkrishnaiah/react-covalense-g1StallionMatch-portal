import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from "src/utils/customFunctions";

export const addToCart = splitApi.injectEndpoints({
  endpoints: (build) => ({
    addToCart: build.mutation<any, any>({
      query: (productDetails) => (
        prepareAPIMutation(api.baseUrl, api.addToCartUrl, '', 'POST', productDetails, true)
        ),
        invalidatesTags: ['CartItems']
    }),
  }),
});

export const { useAddToCartMutation } = addToCart;
