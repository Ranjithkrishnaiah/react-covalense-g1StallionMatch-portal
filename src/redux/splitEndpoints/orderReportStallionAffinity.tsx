import { OrderReportSchema } from 'src/@types/orderReport'
import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from 'src/utils/customFunctions';

export const apiWithorderAffinityReport = splitApi.injectEndpoints({
    endpoints: (build) =>({
        reportAffinity: build.mutation<any,OrderReportSchema>({
            query: reportDetails => (prepareAPIMutation(api.baseUrl, api.addToCartStaliionAffinityUrl, '', 'POST', reportDetails, true)),
            invalidatesTags: ['CartItems']
        })
    })
});

export const { useReportAffinityMutation } = apiWithorderAffinityReport;