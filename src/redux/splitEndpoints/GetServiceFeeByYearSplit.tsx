import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIQuery } from 'src/utils/customFunctions';

export const apiWithGetServiceFeeByYearSplit = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getServiceFeeByYear: build.query<any, any>({
      query: (params : any) =>
        prepareAPIQuery(
          api.baseUrl,
          api.stallions + '/' + params.stallionId + '/service-fee-by-year/' + params.feeYear,
          '',
          true
        ),
      providesTags: (result, error) => [{ type: 'Currencies' }],
    }),
  }),
});
export const { useGetServiceFeeByYearQuery } = apiWithGetServiceFeeByYearSplit;
