import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIQuery } from "src/utils/customFunctions";

export const getHorsesCounts = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getMyHorseCounts: build.query<any, void>({
      query: () => (prepareAPIQuery(api.baseUrl, api.horseCountUrl, '', true)),
      keepUnusedDataFor: 0,
      providesTags: (result, error) => [{ type: 'My Horses' }],
    }),
  }),
});

export const { useGetMyHorseCountsQuery } = getHorsesCounts;