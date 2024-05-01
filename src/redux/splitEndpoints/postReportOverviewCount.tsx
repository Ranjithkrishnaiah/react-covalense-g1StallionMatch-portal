import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from 'src/utils/customFunctions';

export const apiWithPostHomePageCount = splitApi.injectEndpoints({
  endpoints: (builder) => ({
    postUnRegisteredReportPageCount: builder.mutation<any, any>({
      query: (data) =>
        prepareAPIMutation(api.baseUrl, api.unRegisteredReportPageCountPath, '', 'POST', data),
        invalidatesTags: ['Home page session count'],
    }),
    postRegisteredReportPageCount: builder.mutation<any, any>({
        query: (data) =>
          prepareAPIMutation(api.baseUrl, api.registeredReportPageCountPath, '', 'POST', data, true),
          invalidatesTags: ['Home page session count'],
      }),
  }),
});

export const { usePostRegisteredReportPageCountMutation, usePostUnRegisteredReportPageCountMutation } = apiWithPostHomePageCount;
