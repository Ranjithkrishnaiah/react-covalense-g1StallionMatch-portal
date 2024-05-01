import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from "src/utils/customFunctions";

export const guestAddToCartStallionStockSales = splitApi.injectEndpoints({
  endpoints: (build) => ({
    guestAddToCartStallionStockSales: build.mutation<any, any>({
      query: (productDetails) => (
        prepareAPIMutation(api.baseUrl, api.guestAddToCartStallionStockSalesUrl, '', 'POST', productDetails, true)
        ),
        invalidatesTags: ['CartItems']
    }),
  }),
});

export const { useGuestAddToCartStallionStockSalesMutation } = guestAddToCartStallionStockSales;
