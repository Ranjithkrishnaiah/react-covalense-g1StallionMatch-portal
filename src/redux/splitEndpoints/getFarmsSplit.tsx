import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { FavoriteList } from 'src/@types/lists';
import { prepareAPIQuery } from 'src/utils/customFunctions';

export const apiWithgetFarms = splitApi.injectEndpoints({
    endpoints: (build) => ({
        getFarms: build.query<FavoriteList ,void>({
            query: () => (prepareAPIQuery(api.baseUrl, api.favoriteDamsiresUrl, '')),
            keepUnusedDataFor: 0, 
            providesTags: (result, error) => [{ type: 'Farms' }],
        })
    })
});

export const { useGetFarmsQuery } = apiWithgetFarms;