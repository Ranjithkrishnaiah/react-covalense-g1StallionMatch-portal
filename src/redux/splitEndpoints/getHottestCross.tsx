import { api } from 'src/api/apiPaths';
import { prepareAPIQuery } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';

type HottestCross = {
  "SireName": string;
  "SireUuid": string;
  "BroodMareName": string;
  "BroodMareUuid": string;
  "SWCounts": number;
  "RunnerCounts": number;
  "Perc": number
}
type HottestCrossResponse = {
  data: HottestCross,
}

export const getHottestCross = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getHottestCross: build.query<HottestCross[], any>({
      query: (params) => (prepareAPIQuery(api.baseUrl, api.hottestCrossUrl, params, true)),
      keepUnusedDataFor: 0,
      providesTags: () => [{ type: 'Hottest Cross' }],
    }),
  }),
});

export const { useGetHottestCrossQuery } = getHottestCross;