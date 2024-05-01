import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from 'src/utils/customFunctions';

export const apiWithpatchNotificationsRead = splitApi.injectEndpoints({
  endpoints: (builder) => ({
    patchNotificationsRead: builder.mutation<any, any>({
      query: (data) =>
        prepareAPIMutation(api.baseUrl, api.notificationsUrl, '', 'PATCH', data, true),
      invalidatesTags: ['Notification', 'Notification Count'],
    }),
  }),
});

export const { usePatchNotificationsReadMutation } = apiWithpatchNotificationsRead;
