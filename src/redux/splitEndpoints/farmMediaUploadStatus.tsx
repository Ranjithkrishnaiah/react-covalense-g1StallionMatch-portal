import React from 'react'
import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from "src/utils/customFunctions";  

export const apiWithFarmMediaUploadStatus = splitApi.injectEndpoints({
  endpoints: (build) => ({
    farmProfileImageUploadStatus: build.mutation<any, any>({
      query: (mediauuid) => (prepareAPIMutation(api.baseUrl, api.mediaUploadStatusUrl, '', 'POST', mediauuid, true)),
      invalidatesTags : ['GetFarmById']
    }),
    farmGalleryImagesUploadStatus: build.mutation<any, any>({
      query: (mediauuid) => (prepareAPIMutation(api.baseUrl, api.mediaUploadStatusUrl, '', 'POST', mediauuid, true)),
      invalidatesTags : ['farmGalleryimage']
    }),
    farmMediaUploadStatus: build.mutation<any, any>({
      query: (mediauuid) => (prepareAPIMutation(api.baseUrl, api.mediaUploadStatusUrl, '', 'POST', mediauuid, true)),
      invalidatesTags : ['farmMedias']
    }),
  }),
}); 
export const { 
  useFarmProfileImageUploadStatusMutation, 
  useFarmGalleryImagesUploadStatusMutation,
  useFarmMediaUploadStatusMutation,

} = apiWithFarmMediaUploadStatus;