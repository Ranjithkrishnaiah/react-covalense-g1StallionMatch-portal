//messageUnReadCount
import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIQuery } from "src/utils/customFunctions";

export const getMessageNominationCounts = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getMessageNominationCounts: build.query<any, any>({
      query: (farmId : any) => (prepareAPIQuery(api.baseUrl, api.messageNominationCounts + farmId, '',true)),
      keepUnusedDataFor: 0,
      providesTags: (result, error) => [{ type: 'MessageUnReadCount' }],
    }),
  }),
});

export const { useGetMessageNominationCountsQuery } = getMessageNominationCounts;