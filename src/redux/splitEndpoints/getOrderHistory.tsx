import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIQuery } from 'src/utils/customFunctions';

export const getOrders = splitApi.injectEndpoints({
    endpoints: (build) => ({
        getOrderHistory: build.query<any ,any>({
            query: (params) => (prepareAPIQuery(api.baseUrl, api.getAllOrdersUrl, params, true)),
            providesTags: (result, error) => [{ type: 'Order History' }],
        }),
        getOrderPdf: build.query<any ,any>({
            query: (sessionId) => (prepareAPIQuery(api.baseUrl, api.orderPdfUrl + '/' + sessionId, '' ,true)),
        }),
        getInvoicePdf: build.query<any ,any>({
            query: (sessionId) => (prepareAPIQuery(api.baseUrl, api.orderInvoicePdf + '/' + sessionId, '' ,true)),
        })
    })
});

export const { useGetOrderHistoryQuery, useGetOrderPdfQuery,useGetInvoicePdfQuery } = getOrders;