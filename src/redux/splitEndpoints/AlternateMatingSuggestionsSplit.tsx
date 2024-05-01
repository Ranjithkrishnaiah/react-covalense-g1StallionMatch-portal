import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AlternateMatingSuggestions } from 'src/@types/AlternateMatingSuggestions';
import { api } from '../../api/apiPaths'
import { splitApi } from '../rootMiddleware';
import { prepareAPIQuery } from "src/utils/customFunctions";

export const apiWithAlternateMatingSuggestions = splitApi.injectEndpoints({
    endpoints: (build) => ({
        alternateMatingSuggestions: build.query<AlternateMatingSuggestions[], any>({
        query: (params: any) => (prepareAPIQuery(api.baseUrl, api.alternateMatingSuggestionsUrl, params)),
        keepUnusedDataFor: 60*60*24*365, //Keeps country data valid for an year
        providesTags: (result, error) => [{ type: 'AlternateMatingSuggestions' }],
      }),
    }),
  });

export const { useAlternateMatingSuggestionsQuery } = apiWithAlternateMatingSuggestions;
