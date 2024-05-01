import { OrderReportSchema } from 'src/@types/orderReport'
import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from 'src/utils/customFunctions';

export const apiWithMatchProReport = splitApi.injectEndpoints({
    endpoints: (build) =>({
        reportMatchPro: build.mutation<any,OrderReportSchema>({
            query: reportDetails => (prepareAPIMutation(api.baseUrl, api.addToCartMatchProUrl, '', 'POST', reportDetails, true)),
            invalidatesTags: ['CartItems']
        })
    })
});

export const { useReportMatchProMutation } = apiWithMatchProReport;