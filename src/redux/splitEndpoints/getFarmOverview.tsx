import { StakesWinnersComparision } from 'src/@types/StakesWinnersComparision';
import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIQuery } from "src/utils/customFunctions";

export const apiWithFarmOverview = splitApi.injectEndpoints({
  endpoints: (builder) => ({
    farmOverview: builder.query<any, object>({
      query: (farmId) => (prepareAPIQuery(api.baseUrl,'/farms/'+farmId+'/overview', '')),
      providesTags: (result, error) => [{ type: 'farmOverview' }],
    }),
  }),
});

export const { useFarmOverviewQuery } = apiWithFarmOverview;
