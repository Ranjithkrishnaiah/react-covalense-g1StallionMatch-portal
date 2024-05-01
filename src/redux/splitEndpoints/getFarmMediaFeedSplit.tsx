import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { FavoriteList } from 'src/@types/lists';
import { prepareAPIQuery } from 'src/utils/customFunctions';

export const getFarmMedia = splitApi.injectEndpoints({
    endpoints: (build) => ({
        getFarmMedia: build.query<FavoriteList ,void>({
            query: () => (prepareAPIQuery(api.baseUrl, api.favoriteDamsiresUrl, '')),
            keepUnusedDataFor: 0, 
            providesTags: (result, error) => [{ type: 'Farm Media' }],
        })
    })
});

export const { useGetFarmMediaQuery } = getFarmMedia;