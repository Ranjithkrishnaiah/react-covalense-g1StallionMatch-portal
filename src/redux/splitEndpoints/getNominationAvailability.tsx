import { api } from 'src/api/apiPaths';
import { prepareAPIQuery } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';

type InputDetails = {
    id: string;
}
export const nominationAvailability = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getNominationAvailability: build.query<boolean, InputDetails>({
      query: (id) => (prepareAPIQuery(api.baseUrl, api.nominationAvailabilityUrl, id)),
      keepUnusedDataFor: 0,
      providesTags: (result, error) => [{ type: 'Nomination Availability' }],
    }),
  }),
});

export const { useGetNominationAvailabilityQuery } = nominationAvailability;