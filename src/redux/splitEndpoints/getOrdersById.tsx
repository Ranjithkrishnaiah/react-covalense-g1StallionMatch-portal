import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIQuery } from 'src/utils/customFunctions';

export const getOrdersbyId = splitApi.injectEndpoints({
    endpoints: (build) => ({
        getOrderListById: build.query<any ,string>({
            query: (Id : string) => (prepareAPIQuery(api.baseUrl, api.getLatestOrderUrl + `/${Id}`,'',true )),
            providesTags: (result, error) => [{ type: 'Discount' }],
        })
    })
});

export const { useGetOrderListByIdQuery } = getOrdersbyId;