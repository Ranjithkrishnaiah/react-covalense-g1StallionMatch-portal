import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from 'src/utils/customFunctions';

export const getDiscount = splitApi.injectEndpoints({
    endpoints: (build) =>({
        discount: build.mutation<any,any>({
            query: discountDetails => (prepareAPIMutation(api.baseUrl, api.getDiscountUrl, '', 'POST', discountDetails, true)),
            invalidatesTags: ['Discount']
        })
    })
});

export const { useDiscountMutation } = getDiscount;