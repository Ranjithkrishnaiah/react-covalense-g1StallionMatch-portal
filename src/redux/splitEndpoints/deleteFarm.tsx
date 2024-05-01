import { MyFarm } from 'src/@types/lists';
import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from 'src/utils/customFunctions';

export const deleteFromMyFarms= splitApi.injectEndpoints({
    endpoints: (build) =>({
        deleteFromMyFarms: build.mutation<any,object>({
            query: obj => (prepareAPIMutation(api.baseUrl, api.farmsUrl, '', 'DELETE', obj, true)),
            invalidatesTags: ['FarmUsersList'],
        })
    })
});

export const { useDeleteFromMyFarmsMutation } = deleteFromMyFarms;