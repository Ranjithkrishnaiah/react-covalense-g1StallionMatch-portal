import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from 'src/utils/customFunctions';

export const PostInterest = splitApi.injectEndpoints({
    endpoints: (build) => ({
        postRequest: build.mutation<void ,any>({
            query: (data) => (prepareAPIMutation(api.baseUrl, api.sendRequestUrl, '', 'POST', data)), 
        })
    })
});

export const { usePostRequestMutation } = PostInterest;