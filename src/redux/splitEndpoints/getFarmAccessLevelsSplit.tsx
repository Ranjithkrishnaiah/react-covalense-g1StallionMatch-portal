import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIQuery } from 'src/utils/customFunctions';

export const apiWithgetFarmAccessLevels = splitApi.injectEndpoints({
    endpoints: (build) => ({
        getFarmAccessLevels: build.query<any ,void>({
            query: () => (prepareAPIQuery(api.baseUrl, api.farmAccessLevels, '')),
            // keepUnusedDataFor: 0, 
            // providesTags: (result, error) => [{ type: 'Farms' }],
        })
    })
});

export const { useGetFarmAccessLevelsQuery } = apiWithgetFarmAccessLevels;