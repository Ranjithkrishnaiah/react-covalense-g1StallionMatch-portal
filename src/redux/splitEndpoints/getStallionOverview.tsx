import { StakesWinnersComparision } from 'src/@types/StakesWinnersComparision';
import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIQuery } from "src/utils/customFunctions";

export const apiWithStallionOverview = splitApi.injectEndpoints({
  endpoints: (builder) => ({
    stallionOverview: builder.query<any, object>({
      query: (stallionId) => (prepareAPIQuery(api.baseUrl,'/stallions/'+stallionId+'/overview', '')),
      providesTags: (result, error) => [{ type: 'stallionOverview' }],
    }),
  }),
});

export const { useStallionOverviewQuery } = apiWithStallionOverview;
