import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIQuery } from 'src/utils/customFunctions';

interface AuthMe {
  id: number;
  email: string;
  memberaddress: any;
  provider: string;
  socialId: string;
  fullName: string;
  hashedRefreshToken: string;
  createdOn: string;
  modifiedOn: string;
  deletedOn: string;
  isVerified: boolean;
  role: {
    id: number;
    roleName: string;
    __entity: string;
  };
  status: {
    id: number;
    statusName: string;
    __entity: string;
  };
  __entity: string;
}

export const apiWithgetAuthMe = splitApi.injectEndpoints({
  endpoints: (build) => ({
    authMe: build.query<AuthMe, any>({
      query: () => prepareAPIQuery(api.baseUrl, api.checkConfirmEmailUrl, '', true),
      keepUnusedDataFor: 60 * 1,
      providesTags: (result, error) => ['AuthMe'],
    }),
  }),
});

export const { useAuthMeQuery } = apiWithgetAuthMe;
