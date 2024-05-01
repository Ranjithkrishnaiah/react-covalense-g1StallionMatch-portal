import { api } from 'src/api/apiPaths';
import { prepareAPIQuery } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';

export const apiWithGetProductsSplit = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getProductsSplit: build.query<any, any>({
      query: (params) => prepareAPIQuery(api.baseUrl, api.products, params, true),
      keepUnusedDataFor: 0,
      providesTags: (result, error) => [{ type: 'getProducts' }],
    }),
    getProductsDetailsBasedOnLocation: build.query<any, any>({
      query: (param) => prepareAPIQuery(api.baseUrl, api.stallions + api.productsDetailsBasedOnLocation + '/' + param, '', true),
    }),
  }),
});

export const { useGetProductsSplitQuery, useGetProductsDetailsBasedOnLocationQuery } = apiWithGetProductsSplit;
