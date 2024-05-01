import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from "src/utils/customFunctions";

type Input = {
  invitationId: number;
  farmId: string;
}
export const resendInvitation = splitApi.injectEndpoints({
  endpoints: (build) => ({
    resendInvite : build.mutation<any, Input>({
      query: (data: any) => (prepareAPIMutation(api.baseUrl, api.resendInvitationUrl, '', 'POST', data,true)),
    }),
  }),
});

export const { useResendInviteMutation } = resendInvitation;