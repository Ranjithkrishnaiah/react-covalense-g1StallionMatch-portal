import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation, prepareAPIQuery } from "src/utils/customFunctions";

export const sendUserProfileImage = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getProfileImage: build.query<any, any>({
      query: () => (prepareAPIQuery(api.baseUrl, api.checkConfirmEmailUrl, "", true)),
      providesTags: ['profileDetails']
    }),
    postUserProfileImageUpload: build.mutation<any, any>({
      query: (payload) => (prepareAPIMutation(api.baseUrl, api.memberProfileImageUpload, '', 'POST', payload, true)),
    }),
    patchImageToAWS : build.mutation<any, any>({
      query: (payload) => (prepareAPIMutation(api.baseUrl, api.patchProfileImageUpload,'', 'PATCH', payload,true))
    })
  }),
});

export const { 
  useGetProfileImageQuery,
  usePostUserProfileImageUploadMutation,
  usePatchImageToAWSMutation
} = sendUserProfileImage;
