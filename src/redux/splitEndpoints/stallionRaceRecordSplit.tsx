import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIQuery } from "src/utils/customFunctions";

export const apiWithStallionRaceRecords = splitApi.injectEndpoints({
  endpoints: (builder) => ({
    raceRecords: builder.query<any, void>({
      query: () => prepareAPIQuery(api.mockBaseUrl, '/' + api.stallionRaceRecord, '', true),
      providesTags: (result, error) => [{ type: 'raceRecords' }],
    }),
  }),
});

export const { useRaceRecordsQuery } = apiWithStallionRaceRecords;
