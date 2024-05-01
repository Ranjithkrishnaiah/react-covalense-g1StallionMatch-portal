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

export const getTopMatchedBroodMareSire = splitApi.injectEndpoints({
    endpoints: (build) => ({
        getTopMatchedBroodMareSire: build.query<TopMatchedBroodMareSire[], any>({
            query: (params) => (prepareAPIQuery(api.baseUrl, api.topMatchedBroodmareSiresUrl, params, true)),
            keepUnusedDataFor: 0,
            providesTags: () => [{ type: 'Top Matched Sires' }],
        }),
    }),
});

export const { useGetTopMatchedBroodMareSireQuery } = getTopMatchedBroodMareSire;