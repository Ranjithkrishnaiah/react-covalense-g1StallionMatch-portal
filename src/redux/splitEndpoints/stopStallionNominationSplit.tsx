import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from "src/utils/customFunctions";

export const apiWithstopStallionNomination = splitApi.injectEndpoints({
  endpoints: (builder) => ({
    stopStallionNomination: builder.mutation<any, any>({
      query:(data : any) => prepareAPIMutation(api.baseUrl, api.stopStallionNomination + '/'+ data?.stallionId, '', 'POST', data?.dataApi, true),
      invalidatesTags: ['stallionRoster']
    }),
  }),
});

export const { useStopStallionNominationMutation } = apiWithstopStallionNomination;