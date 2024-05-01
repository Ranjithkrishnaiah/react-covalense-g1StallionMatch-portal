import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIQuery } from "src/utils/customFunctions";
import { MatchedMares } from 'src/@types/MatchedMares';

type MatchedMareInput = {
  stallionId: string;
  fromDate: string;
  toDate: string;
  page: number;
  limit: number;
  filterBy:string;
}
export const apiWithMatchedMares = splitApi.injectEndpoints({
  endpoints: (builder) => ({
    matchedMares: builder.query<any, MatchedMareInput>({
      query: (params) => prepareAPIQuery(api.baseUrl, '/' + api.matchedMares, params, true),
      providesTags: (result, error) => [{ type: 'matchedMares' }],
    }),
  }),
});

export const { useMatchedMaresQuery } = apiWithMatchedMares;
