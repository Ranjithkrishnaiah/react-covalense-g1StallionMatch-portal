import { OrderReportSchema } from 'src/@types/orderReport'
import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from 'src/utils/customFunctions';

export const apiWithorderReport = splitApi.injectEndpoints({
    endpoints: (build) =>({
        report: build.mutation<any,OrderReportSchema>({
            query: reportDetails => (prepareAPIMutation(api.baseUrl, api.addToCartUrl, '', 'POST', reportDetails, true)),
            invalidatesTags: ['CartItems']
        })
    })
});

export const { useReportMutation } = apiWithorderReport;