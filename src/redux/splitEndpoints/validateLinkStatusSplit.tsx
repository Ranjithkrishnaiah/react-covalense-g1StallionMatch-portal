import { api } from 'src/api/apiPaths';
import { prepareAPIMutation } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';

type LinkValidationResponse = {
  fullName: string;
  email: string;
  isValid?: boolean;
  errors?:{hash: string}
};

type Hash = {
  hash: string;
};

export const apiWithValidateLinkStatus = splitApi.injectEndpoints({
  endpoints: (build) => ({
    ValidateLink: build.mutation<LinkValidationResponse, Hash>({
      query: (link) => prepareAPIMutation(api.baseUrl, api.ValidateLinkStatusUrl, '', 'POST', link),
    }),
  }),
});

export const { useValidateLinkMutation } = apiWithValidateLinkStatus;
