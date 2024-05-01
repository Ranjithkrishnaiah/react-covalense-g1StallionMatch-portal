import { StallionRoster } from 'src/@types/StallionRoster';
import { splitApi } from '../rootMiddleware';
import { prepareAPIQuery } from 'src/utils/customFunctions';
import { api } from 'src/api/apiPaths';

export const apiWithStallionRoaster = splitApi.injectEndpoints({
  endpoints: (builder) => ({
    stallionRoster: builder.query<any, object>({
      query: (params: any) =>
        prepareAPIQuery(api.baseUrl, params.Url, params.body, true),
      providesTags: (result, error) => ['stallionRoster'],
    }),
    farmStallions: builder.query<any, object>({
      query: (params: any) =>
        prepareAPIQuery(api.baseUrl, params.Url, params.body),
      providesTags: (result, error) => ['stallionRoster'],
    }),
  }),
});

export const { useStallionRosterQuery, useFarmStallionsQuery } = apiWithStallionRoaster;
