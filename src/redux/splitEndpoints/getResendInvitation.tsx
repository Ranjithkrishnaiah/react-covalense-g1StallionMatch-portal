import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIQuery } from "src/utils/customFunctions";

export const resendInvitation = splitApi.injectEndpoints({
  endpoints: (build) => ({
    resendInvite : build.query<any, any>({
      query: (data: any) => (prepareAPIQuery(api.baseUrl, api.resendInvitationUrl + data, '',true)),
    }),
  }),
});

export const { useResendInviteQuery } = resendInvitation;