import { FavoriteList } from 'src/@types/lists';
import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIQuery } from 'src/utils/customFunctions';

export const apiWithgetStallions = splitApi.injectEndpoints({
    endpoints: (build) => ({
        getStallions: build.query<FavoriteList,void>({
            query: () => (prepareAPIQuery(api.baseUrl, api.favouriteStallionsUrl, '', true)),
            keepUnusedDataFor: 0, 
            providesTags: (result, error) => [{ type: 'Stallions' }],
        })
    })
});

export const { useGetStallionsQuery } = apiWithgetStallions;
