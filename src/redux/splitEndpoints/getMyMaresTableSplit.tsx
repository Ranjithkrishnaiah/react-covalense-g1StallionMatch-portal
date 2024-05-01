import { MyMares } from 'src/@types/lists';
import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIQuery } from "src/utils/customFunctions";
import { QueryParams } from './getFavFarmsSplit';
export const GetMyMaresTable = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getMaresTable: build.query<MyMares, QueryParams>({
      query: (params) => (prepareAPIQuery(api.baseUrl, api.maresTableUrl, params, true)),
      keepUnusedDataFor: 0,
      providesTags: (result, error) => [{ type: 'MyMares Table' }],
    }),
  }),
});

export const { useGetMaresTableQuery } = GetMyMaresTable;