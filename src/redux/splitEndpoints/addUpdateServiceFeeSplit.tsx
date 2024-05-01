import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from 'src/utils/customFunctions';

export const apiWithaddUpdateServiceFee = splitApi.injectEndpoints({
  endpoints: (builder) => ({
    addUpdateServiceFee: builder.mutation<any, object>({
      query: (data: any) =>
        prepareAPIMutation(
          api.baseUrl,
          api.updateServiceFeeUrl + '/' + data?.stallionId,
          '',
          'PATCH',
          data?.dataApi,
          true
        ),
        invalidatesTags: ['stallionRoster']
    }),
  }),
});

export const { useAddUpdateServiceFeeMutation } = apiWithaddUpdateServiceFee;
