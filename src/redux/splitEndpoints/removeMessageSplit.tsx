import { api } from 'src/api/apiPaths';
import { prepareAPIMutation } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';

export const apiWithRemoveMessageSplit = splitApi.injectEndpoints({
    endpoints: (build) =>({
        removeMessage: build.mutation<any,any>({
            query: data => (prepareAPIMutation(api.baseUrl, api.stallions,'', 'DELETE',data,true)),
        })
    })
});

export const { useRemoveMessageMutation } = apiWithRemoveMessageSplit;