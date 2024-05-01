import { api } from 'src/api/apiPaths';
import { prepareAPIQuery } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';

type NotificationPreferences = {
    NotificationId: number;
    isActive : boolean;
}
export const notificationPreferences = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getNotificationPreferences: build.query<NotificationPreferences[], void>({
      query: () => (prepareAPIQuery(api.baseUrl, api.notificationPreferencesUrl, '', true)),
      keepUnusedDataFor: 0,
      providesTags: (result, error) => [{ type: 'Notification Preferences' }],
    }),
  }),
});

export const { useGetNotificationPreferencesQuery } = notificationPreferences;