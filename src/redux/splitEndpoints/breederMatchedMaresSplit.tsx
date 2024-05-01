import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIQuery } from "src/utils/customFunctions";
import { MatchedMares } from 'src/@types/MatchedMares';

type MatchedMareInput = {
    farmId: string;
    fromDate: string;
    toDate: string;
    page: number;
    limit: number;
    filterBy:string;
}
export const apiWithBreederMatchedMares = splitApi.injectEndpoints({
    endpoints: (builder) => ({
        breederMatchedMares: builder.query<any, MatchedMareInput>({
            query: (params) => prepareAPIQuery(api.baseUrl, '/' + api.breederMatchedMares, params, true),
            providesTags: (result, error) => [{ type: 'breederMatchedMares' }],
        }),
    }),
});

export const { useBreederMatchedMaresQuery } = apiWithBreederMatchedMares;
