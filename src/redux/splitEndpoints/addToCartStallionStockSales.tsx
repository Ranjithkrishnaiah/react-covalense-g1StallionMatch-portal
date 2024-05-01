// addToCartStallionStockSales

import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from "src/utils/customFunctions";

export const addToCartStallionStockSales = splitApi.injectEndpoints({
  endpoints: (build) => ({
    addToCartStallionStockSales: build.mutation<any, any>({
      query: (productDetails) => (
        prepareAPIMutation(api.baseUrl, api.addToCartStallionStockSalesUrl, '', 'POST', productDetails, true)
        ),
        invalidatesTags: ['CartItems']
    }),
  }),
});

export const { useAddToCartStallionStockSalesMutation } = addToCartStallionStockSales;
