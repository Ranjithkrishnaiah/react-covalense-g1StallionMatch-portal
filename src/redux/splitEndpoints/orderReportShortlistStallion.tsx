import { OrderReportSchema } from 'src/@types/orderReport'
import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from 'src/utils/customFunctions';

export const apiWithShortlistStallion = splitApi.injectEndpoints({
    endpoints: (build) =>({
        reportShortlistStallion: build.mutation<any,any>({
            query: reportDetails => (prepareAPIMutation(api.baseUrl, api.addToCartShortListUrl, '', 'POST', reportDetails, true)),
            invalidatesTags: ['CartItems']
        })
    })
});

export const { useReportShortlistStallionMutation } = apiWithShortlistStallion;