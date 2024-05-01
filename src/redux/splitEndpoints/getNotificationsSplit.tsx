import { Notification, NotificationsList, NotificationsResponse } from 'src/@types/notification';
import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIQuery } from 'src/utils/customFunctions';

export const apiWithgetNotifications = splitApi.injectEndpoints({
  endpoints: (builder) => ({
    notifications: builder.query<NotificationsResponse, object>({
      query: (params) => prepareAPIQuery(api.baseUrl, api.notificationsUrl, params, true),
      keepUnusedDataFor: 60 * 1,
      providesTags: (result, error) => [{ type: 'Notification' }],
    }),

    farmNotifications: builder.query<NotificationsResponse, object>({
      query: (params) => prepareAPIQuery(api.baseUrl, api.notificationsUrl + '/farm', params, true),
      keepUnusedDataFor: 60 * 1,
      providesTags: (result, error) => [{ type: 'Notification' }],
    }),
  }),
});

export const { useNotificationsQuery, useFarmNotificationsQuery } = apiWithgetNotifications;
