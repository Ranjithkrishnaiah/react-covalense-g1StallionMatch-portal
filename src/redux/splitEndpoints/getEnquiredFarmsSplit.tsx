import { api } from 'src/api/apiPaths';
import { prepareAPIQuery } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';

interface EnquiredForm {
  farmUuid: string;
  farmName: string;
}

export const apiWithgetEnquiredFarmsSplit = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getEnquiredFarmsSplit: build.query<any, void>({
      query: () => prepareAPIQuery(api.baseUrl, api.messagesUrl + '/enquired-farms', '', true),
      keepUnusedDataFor: 0,
      providesTags: (result, error) => [{ type: 'getEnquiredFarms' }],
    }),
  }),
});

export const { useGetEnquiredFarmsSplitQuery } = apiWithgetEnquiredFarmsSplit;
