

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

export const getTopTenPerfectMatchMatchedSire = splitApi.injectEndpoints({
    endpoints: (build) => ({
        getTopTenPerfectMatchMatchedSire: build.query<MostMatchedSire[], any>({
            query: (params) => (prepareAPIQuery(api.baseUrl, api.topTenPerfectMatchedSiresUrl, params, true)),
            keepUnusedDataFor: 0,
            providesTags: () => [{ type: 'Top Ten Perfect Matched Sires' }],
        }),
    }),
});

export const { useGetTopTenPerfectMatchMatchedSireQuery } = getTopTenPerfectMatchMatchedSire;