import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIQuery } from 'src/utils/customFunctions';

export const apiWithgetUsersFarmList = splitApi.injectEndpoints({
    endpoints: (build) => ({
        getUsersFarmList: build.query<any ,any>({
            query: () => (prepareAPIQuery(api.baseUrl, api.farmuserList, '',true)),
            keepUnusedDataFor: 0, 
            providesTags: (result, error) => [{ type: 'FarmUsersList' }],
        })
    })
});

export const { useGetUsersFarmListQuery } = apiWithgetUsersFarmList;