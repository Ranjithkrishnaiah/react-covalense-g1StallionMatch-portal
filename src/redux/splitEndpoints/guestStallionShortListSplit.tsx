import { GuestStallionShortlist } from 'src/@types/GuestStallionShortlist';
import { api } from 'src/api/apiPaths';
import { prepareAPIQuery } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';

export const apiWithGuestStallionShortList = splitApi.injectEndpoints({
  endpoints: (builder) => ({
    guestStallionShortlists: builder.query<GuestStallionShortlist, object>({
      query: (params) => (prepareAPIQuery(api.baseUrl, api.guestStallionShortlist, params)),
      providesTags: (result, error) => [{ type: 'guestStallionShortlist' }],
    }),
  }),
});

export const { useGuestStallionShortlistsQuery } = apiWithGuestStallionShortList;
