import { api } from 'src/api/apiPaths';
import { prepareAPIMutation } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';

export const apiWithremoveStallion = splitApi.injectEndpoints({
    endpoints: (build) =>({
        apiWithremoveStallion: build.mutation<any,any>({
            query: data => (prepareAPIMutation(api.baseUrl, api.stallions,'', 'DELETE',data,true)),
            invalidatesTags: ['Favorite Stallion Table'],
        })
    })
});

export const { useApiWithremoveStallionMutation } = apiWithremoveStallion;