import { api } from 'src/api/apiPaths';
import { prepareAPIMutation, prepareAPIQuery } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';

// type OrderResponse = {
//     data: any[];
//     meta: any
// }

export const apiWithgetCartItems = splitApi.injectEndpoints({
    endpoints: (build) => ({
        getCartItems: build.query<any[], any>({
            query: () => (prepareAPIQuery(api.baseUrl, api.cartItemUrl, '', true)),
            keepUnusedDataFor: 0,
            providesTags: (result, error) => ['CartItems'],
        }),
        getCartInfo: build.query<any, any>({
            query: (cartId: any) =>
                prepareAPIQuery(
                    api.baseUrl,
                    api.cartItemUrl + '/' + cartId,
                    '', true
                ),
        }),
        getConvertedCurrencyList: build.mutation<any, object>({
            query: (data) => (prepareAPIMutation(api.baseUrl, api.cartItemUrl + api.cartCurrencyConversionUrl, '', 'POST', data, false)),
            invalidatesTags: ['CartItems']
        }),
    })
});

export const { useGetCartItemsQuery, useGetCartInfoQuery,useGetConvertedCurrencyListMutation } = apiWithgetCartItems;