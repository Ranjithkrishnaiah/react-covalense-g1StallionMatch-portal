import { StakesWinnersComparision } from 'src/@types/StakesWinnersComparision';
import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIQuery } from "src/utils/customFunctions";

export const apiWithStakesWinnerComp = splitApi.injectEndpoints({
  endpoints: (builder) => ({
    stakesWinnersComparision: builder.query<any, object>({
      query: (param) => (prepareAPIQuery(api.baseUrl,'/stallions'+api.stakesWinnersComparisionUrl, param)),
      providesTags: (result, error) => [{ type: 'stakesWinnersComparision' }],
    }),
  }),
});

export const { useStakesWinnersComparisionQuery } = apiWithStakesWinnerComp;
