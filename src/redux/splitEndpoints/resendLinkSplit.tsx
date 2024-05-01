import { api } from 'src/api/apiPaths';
import { ResendLinkSchema } from 'src/forms/LinkExpired';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from 'src/utils/customFunctions';

export const apiWithResendLink = splitApi.injectEndpoints({
  endpoints: (build) => ({
    resendLink: build.mutation<void, ResendLinkSchema>({
      query: (previousLink) => 
      (prepareAPIMutation(api.baseUrl, api.resendLinkUrl, '', 'POST', previousLink)),
    }),
  }),
});

export const { useResendLinkMutation } = apiWithResendLink;
