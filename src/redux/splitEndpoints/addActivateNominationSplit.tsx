import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from "src/utils/customFunctions";

export const apiWithaddActivateNomination = splitApi.injectEndpoints({
  endpoints: (builder) => ({
    addActivateNomination: builder.mutation<any, object>({
      query: (data) => 
      prepareAPIMutation(api.baseUrl, api.stallionNominationUrl, '', 'POST', data, true),
      invalidatesTags: ['stallionRoster']
    }),
  }),
});

export const { useAddActivateNominationMutation } = apiWithaddActivateNomination;