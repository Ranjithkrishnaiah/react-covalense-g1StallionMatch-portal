import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from "src/utils/customFunctions";
import { Farms } from 'src/@types/Farms';

export const apiWithPatchFarmDetailsById = splitApi.injectEndpoints({
  endpoints: (build) => ({
    patchFarmDetails: build.mutation<Farms, Pick<Farms, 'farmId'> & Partial<Farms>>({
      query: ({ farmId, ...payload }) => (prepareAPIMutation(api.baseUrl, api.farmsUrl + '/' + farmId + '/profile', '', 'PATCH', payload, true)),
      invalidatesTags:['GetFarmById']
    }),
    patchFarmProfileOverview: build.mutation<any, Pick<any, 'farmId'> & Partial<any>>({
      query: ({ farmId, ...payload }) => (prepareAPIMutation(api.baseUrl, api.farmsUrl + '/' + farmId + '/overview', '', 'PATCH', payload, true)),
      invalidatesTags:['GetFarmById']
    }),
    patchFarmProfileGalleryimage: build.mutation<any, Pick<any, 'farmId'> & Partial<any>>({
      query: ({ farmId, ...payload }) => (prepareAPIMutation(api.baseUrl, api.farmsUrl + '/' + farmId + api.galleryImage, '', 'PATCH', payload, true)),
      invalidatesTags : ['farmGalleryimage']
    }),
    patchFarmMediaFiles: build.mutation<any, Pick<any, 'farmId'> & Partial<any>>({
      query: ({ farmId, ...payload }) => (prepareAPIMutation(api.baseUrl, api.farmsUrl + '/' + farmId + api.mediaUrl, '', 'PATCH', payload, true)),
      invalidatesTags: ['farmMedias']
    }),
    postFarmProfileImageUpload: build.mutation<any, any>({
      query: (payload) => (prepareAPIMutation(api.baseUrl, api.farmsUrl + '/' + payload?.farmId + api.profileImageUpload, '', 'POST', payload, true)),
    }),
    postFarmGalleryimageUpload: build.mutation<any, any>({
      query: (payload) => (prepareAPIMutation(api.baseUrl, api.farmsUrl + '/' + payload?.farmId + api.galleryImage, '', 'POST', payload, true)),
    }),
    postFarmMediaFilesUpload: build.mutation<any, any>({
      query: (payload) => (prepareAPIMutation(api.baseUrl, api.farmsUrl + '/' + payload?.farmId + api.farmMediaUrl, '', 'POST', payload, true)),
    }),
  }),
});

export const { usePatchFarmDetailsMutation,
              usePatchFarmProfileOverviewMutation,
              usePatchFarmProfileGalleryimageMutation,
              usePatchFarmMediaFilesMutation,
              usePostFarmProfileImageUploadMutation,
              usePostFarmGalleryimageUploadMutation,
              usePostFarmMediaFilesUploadMutation} = apiWithPatchFarmDetailsById;
