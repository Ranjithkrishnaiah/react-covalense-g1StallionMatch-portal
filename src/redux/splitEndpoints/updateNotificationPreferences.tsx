import { Favorite } from 'src/@types/lists';
import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from "src/utils/customFunctions";

type Body = {
    notificationTypeId: number;
    isActive: boolean;
}
export const updateNotificationPreferences = splitApi.injectEndpoints({
  endpoints: (build) => ({
    updatePreferences: build.mutation<any, Body>({
      query: (notification) => (prepareAPIMutation(api.baseUrl, api.notificationPreferencesUrl, '', 'POST', notification, true)),
      invalidatesTags: ['Notification Preferences']
    }),
  }),
});

export const { useUpdatePreferencesMutation } = updateNotificationPreferences;