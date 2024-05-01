import { AuthResponse, RegisterDetails } from 'src/@types/registration';
import { splitApi } from '../rootMiddleware';
import { api } from 'src/api/apiPaths';
import { prepareAPIMutation } from 'src/utils/customFunctions';

export const apiWithRegistration = splitApi.injectEndpoints({
  endpoints: (build) => ({
    registration: build.mutation<AuthResponse, RegisterDetails>({
      query: (inputParam) => 
      (prepareAPIMutation(api.baseUrl, inputParam.postUrl, '', 'POST', inputParam.finalBody)),
    }),
  }),
});

export const { useRegistrationMutation } = apiWithRegistration;
