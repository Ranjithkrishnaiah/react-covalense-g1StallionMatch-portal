import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from "src/utils/customFunctions";

export const apiWithPostProfileNotificationSettings = splitApi.injectEndpoints({
  endpoints: (build) => ({
    postProfileNotificationSettings : build.mutation<any, any>({
      query: (data: any) => (prepareAPIMutation(api.baseUrl, api.maresTableUrl, '', 'POST', data,true)),
    }),
  }),
});

export const {  usePostProfileNotificationSettingsMutation} = apiWithPostProfileNotificationSettings;