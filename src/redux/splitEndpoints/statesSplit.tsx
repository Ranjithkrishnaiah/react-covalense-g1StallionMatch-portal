import { States } from 'src/@types/states';
import { api } from 'src/api/apiPaths';
import { prepareAPIQuery } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';

export const apiWithStates = splitApi.injectEndpoints({
  endpoints: (build) => ({
    states: build.query<States[], void>({
      query: (id) => prepareAPIQuery(api.baseUrl, api.statesByCountryIdUrl + id, ''),
      providesTags: (result, error) => [{ type: 'States' }],
    }),
  }),
});

export const { useStatesQuery } = apiWithStates;
