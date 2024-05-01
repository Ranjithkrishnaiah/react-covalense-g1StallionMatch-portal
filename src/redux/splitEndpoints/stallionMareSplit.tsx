import { StallionMare } from 'src/@types/stallionMare';
import { api } from 'src/api/apiPaths';
import { prepareAPIMutation } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';

export const apiWithStallionMare = splitApi.injectEndpoints({
  endpoints: (build) => ({
    stallionMatch: build.mutation<void, StallionMare>({
      query: (stallionMareDetails) => (prepareAPIMutation(api.baseUrl, api.statesByCountryIdUrl, '', 'POST', stallionMareDetails)),
    }),
  }),
});

export const { useStallionMatchMutation } = apiWithStallionMare;
