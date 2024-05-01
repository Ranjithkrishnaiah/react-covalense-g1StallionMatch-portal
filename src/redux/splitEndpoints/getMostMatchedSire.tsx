import { api } from 'src/api/apiPaths';
import { prepareAPIQuery } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';

type MostMatchedSire = {
    "Sireid": number,
    "horseName": string,
    "TotalRunners": number,
    "TotalStakeWinners": number,
    "Perc": number
}

export const getMostMatchedSire = splitApi.injectEndpoints({
    endpoints: (build) => ({
        getMostMatchedSire: build.query<MostMatchedSire[], any>({
            query: (params) => (prepareAPIQuery(api.baseUrl, api.topMatchedSiresUrl, params, true)),
            keepUnusedDataFor: 0,
            providesTags: () => [{ type: 'Top Matched Sires' }],
        }),
    }),
});

export const { useGetMostMatchedSireQuery } = getMostMatchedSire;