import { api } from 'src/api/apiPaths';
import { prepareAPIQuery } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';

type InputDetails = {
    id: string;
}
export const getMinimumFee = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getRaceRecords: build.query<number, InputDetails>({
      query: (id) => (prepareAPIQuery(api.baseUrl, api.quoteSuggestionUrl, id)),
      keepUnusedDataFor: 0,
      providesTags: (result, error) => [{ type: 'Fee Suggestion' }],
    }),
  }),
});

export const { useGetRaceRecordsQuery } = getMinimumFee;