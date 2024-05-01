import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from 'src/utils/customFunctions';

export const apiWithPostHomePageCount = splitApi.injectEndpoints({
  endpoints: (builder) => ({
    postUnRegisteredCount: builder.mutation<any, any>({
      query: (data) =>
        prepareAPIMutation(api.baseUrl, api.unRegisteredHomePageCountPath, '', 'POST', data),
        invalidatesTags: ['Home page session count'],
    }),
    postRegisteredCount: builder.mutation<any, any>({
        query: (data) =>
          prepareAPIMutation(api.baseUrl, api.registeredHomePageCountPath, '', 'POST', data, true),
          invalidatesTags: ['Home page session count'],
      }),
  }),
});

export const { usePostUnRegisteredCountMutation, usePostRegisteredCountMutation } = apiWithPostHomePageCount;
