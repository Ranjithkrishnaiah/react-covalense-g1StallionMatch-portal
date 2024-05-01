import { OrderReportSchema } from 'src/@types/orderReport'
import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from 'src/utils/customFunctions';

export const apiWithBroodMareAffinityReport = splitApi.injectEndpoints({
    endpoints: (build) =>({
        reportBroodMareAffinity: build.mutation<any,OrderReportSchema>({
            query: reportDetails => (prepareAPIMutation(api.baseUrl, api.addToCartBroodMareAffinityUrl, '', 'POST', reportDetails, true)),
            invalidatesTags: ['CartItems']
        })
    })
});

export const { useReportBroodMareAffinityMutation } = apiWithBroodMareAffinityReport;