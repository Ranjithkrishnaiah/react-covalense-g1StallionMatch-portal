import React from 'react'
import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from "src/utils/customFunctions";  

export const apiWithMediaUploadStatus = splitApi.injectEndpoints({
  endpoints: (build) => ({
    stallionProfileImageUploadStatus: build.mutation<any, any>({
      query: (mediauuid) => (prepareAPIMutation(api.baseUrl, api.mediaUploadStatusUrl, '', 'POST', mediauuid, true)),
      invalidatesTags : ['stallionDetails']
    }),
    stallionHeroImagesUploadStatus: build.mutation<any, any>({
      query: (mediauuid) => (prepareAPIMutation(api.baseUrl, api.mediaUploadStatusUrl, '', 'POST', mediauuid, true)),
      invalidatesTags : ['stallionGalleryimage']
    }),
    stallionTestimonialsImagesUploadStatus: build.mutation<any, any>({
      query: (mediauuid) => (prepareAPIMutation(api.baseUrl, api.mediaUploadStatusUrl, '', 'POST', mediauuid, true)),
      invalidatesTags : ['stallionTestimonials']
    }),
    profileImagesUploadStatus: build.mutation<any, any>({
      query: (mediauuid) => (prepareAPIMutation(api.baseUrl, api.mediaUploadStatusUrl, '', 'POST', mediauuid, true)),
      invalidatesTags : ['profileDetails']
    }),
  }),
}); 
export const { 
  useStallionProfileImageUploadStatusMutation, 
  useStallionHeroImagesUploadStatusMutation,
  useStallionTestimonialsImagesUploadStatusMutation,
  useProfileImagesUploadStatusMutation

} = apiWithMediaUploadStatus;