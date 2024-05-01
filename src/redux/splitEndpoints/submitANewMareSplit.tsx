import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from "src/utils/customFunctions";

export const apiWithsubmitANewMare = splitApi.injectEndpoints({
  endpoints: (builder) => ({
    submitANewMare: builder.mutation<any, object>({
      query: (data) => 
      prepareAPIMutation(api.baseUrl, api.submitANewMare, '', 'POST', data, true),
    }),
  }),
});

export const { useSubmitANewMareMutation } = apiWithsubmitANewMare;