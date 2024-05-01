import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from "src/utils/customFunctions";

export const apiWithPostUnRegisteredUserContactForm = splitApi.injectEndpoints({
  endpoints: (builder) => ({
    postUnRegisteredUserContactForm: builder.mutation<any, any>({
      query: (data) => 
      prepareAPIMutation(api.baseUrl, api.inviteUserUrl+'/invite-stallion', '', 'POST', data),
    }),
  }),
});

export const { usePostUnRegisteredUserContactFormMutation } = apiWithPostUnRegisteredUserContactForm;