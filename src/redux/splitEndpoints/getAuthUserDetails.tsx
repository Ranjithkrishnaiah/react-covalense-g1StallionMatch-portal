
import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIQuery } from 'src/utils/customFunctions';

export const apiWithgetAuthUserDetails = splitApi.injectEndpoints({
    endpoints: (build) => ({
      authUserDetails: build.query<any ,void>({
        query: () => prepareAPIQuery(api.baseUrl, api.checkConfirmEmailUrl, '', true),
        keepUnusedDataFor: 60 * 1,
        providesTags: (result, error) => [{ type: 'AuthUserDetails' }],
      }),
    }),
  });

export const { useAuthUserDetailsQuery } = apiWithgetAuthUserDetails;