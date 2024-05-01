import { Email } from 'src/@types/profile';
import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from "src/utils/customFunctions";

export const editEmail = splitApi.injectEndpoints({
  endpoints: (build) => ({
    editEmail: build.mutation<Email, Email>({
      query: (email) => (
        prepareAPIMutation(api.baseUrl, api.editEmailUrl, '', 'PATCH', email, true)
        ),
        invalidatesTags: ['User Email', 'AuthMe']
    }),
  }),
});

export const { useEditEmailMutation } = editEmail;
