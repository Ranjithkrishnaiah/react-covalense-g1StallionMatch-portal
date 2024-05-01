

import { api } from 'src/api/apiPaths';
import { prepareAPIQuery } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';

type TopMatchedBroodMareSire = {
    "BroodMareSireid": 13463,
    "horseName": string,
    "TotalRunners": number,
    "TotalStakeWinners": number,
    "Perc":number
}

export const getTopTenPerfectMatchedBroodMareSire = splitApi.injectEndpoints({
    endpoints: (build) => ({
        getTopTenPerfectMatchedBroodMareSire: build.query<TopMatchedBroodMareSire[], any>({
            query: (params) => (prepareAPIQuery(api.baseUrl, api.topTenPerfectMatchedBroodmareSiresUrl, params, true)),
            keepUnusedDataFor: 0,
            providesTags: () => [{ type: 'Top 10 Perfect Matched BroodMare Sires' }],
        }),
    }),
});

export const { useGetTopTenPerfectMatchedBroodMareSireQuery } = getTopTenPerfectMatchedBroodMareSire;