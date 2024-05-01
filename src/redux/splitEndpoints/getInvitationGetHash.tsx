import { Notification, NotificationsList, NotificationsResponse } from 'src/@types/notification';
import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIQuery } from 'src/utils/customFunctions';

export const apiGetHasgInvitation = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getCheckInvitaionGetHash: build.query<any, any>({
      query: () => prepareAPIQuery(api.baseUrl, api.checkInvitationGetHash, '', true),
      keepUnusedDataFor: 0,
      providesTags: (result, error) => [{ type: 'InvitaionGetHash' }],
    }),

    getOrderSessionData: build.query<any, any>({
      query: (params) => prepareAPIQuery(api.baseUrl, params, '', true),
      keepUnusedDataFor: 0,
      providesTags: (result, error) => [{ type: 'InvitaionGetHash' }],
    }),
  }),
});

export const { useGetCheckInvitaionGetHashQuery, useGetOrderSessionDataQuery } =
  apiGetHasgInvitation;
