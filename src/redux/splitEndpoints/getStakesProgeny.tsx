import { api } from 'src/api/apiPaths';
import { prepareAPIQuery } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';

type StakesProgenyResponse = {
  data: any[];
  meta: object
}
export const stakesProgenyTable = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getStakesProgeny: build.query<any, any>({
      query: (params) => (prepareAPIQuery(api.baseUrl, api.stallions + '/' + params.stallionId + api.stakesProgenyUrl, params)),
      keepUnusedDataFor: 0,
      providesTags: (result, error) => [{ type: 'Stakes Progeny' }],
    }),
  }),
});

export const { useGetStakesProgenyQuery } = stakesProgenyTable;