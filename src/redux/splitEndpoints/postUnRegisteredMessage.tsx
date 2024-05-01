import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from 'src/utils/customFunctions';

export const apiWithPostUnRegisteredMessage = splitApi.injectEndpoints({
  endpoints: (builder) => ({
    postUnRegisteredMessage: builder.mutation<any, any>({
      query: (data) =>
        prepareAPIMutation(api.baseUrl, api.messagesUrl + '/unregistered', '', 'POST', data),
      invalidatesTags: [
        'PostUnRegisteredMessage',
        'AllMessages',
        'MessageFarmList',
        'getEnquiredFarms',
      ],
    }),
  }),
});

export const { usePostUnRegisteredMessageMutation } = apiWithPostUnRegisteredMessage;
