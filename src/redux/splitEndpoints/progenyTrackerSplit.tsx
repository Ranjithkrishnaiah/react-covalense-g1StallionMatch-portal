import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIQuery } from "src/utils/customFunctions";

export const apiWithProgenyTracker = splitApi.injectEndpoints({
  endpoints: (builder) => ({
    progenyTrackerSR: builder.query<any, void>({
      query: () => prepareAPIQuery(api.mockBaseUrl, '/' + api.progenyTrackerSR, '', true),
      providesTags: (result, error) => [{ type: 'progenyTrackerSR' }],
    }),
    progenyTrackerSP: builder.query<any, void>({
      query: () => prepareAPIQuery(api.mockBaseUrl, '/' + api.progenyTrackerSP, '', true),
      providesTags: (result, error) => [{ type: 'progenyTrackerSP' }],
    }),
  }),
});

export const { useProgenyTrackerSRQuery, useProgenyTrackerSPQuery } = apiWithProgenyTracker;
