import { FavoriteStallionList } from 'src/@types/lists';
import { api } from 'src/api/apiPaths';
import { prepareAPIQuery } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';

export const raceRecordsTable = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getRaceRecords: build.query<any, string>({
      query: (id : string) => (prepareAPIQuery(api.baseUrl, api.stallions + "/"+ id + api.raceRecordsUrl, '')),
      keepUnusedDataFor: 0,
      providesTags: (result, error) => [{ type: 'Race Records' }],
    }),
  }),
});

export const { useGetRaceRecordsQuery } = raceRecordsTable;