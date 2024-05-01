import { OrderReportSchema } from 'src/@types/orderReport'
import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from 'src/utils/customFunctions';

export const apiWithMatchSalesReport = splitApi.injectEndpoints({
    endpoints: (build) =>({
        reportMatchSales: build.mutation<any,OrderReportSchema>({
            query: reportDetails => (prepareAPIMutation(api.baseUrl, api.addToCartMatchSalesUrl, '', 'POST', reportDetails, true)),
            invalidatesTags: ['CartItems']
        })
    })
});

export const { useReportMatchSalesMutation } = apiWithMatchSalesReport;