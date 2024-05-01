import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { ProfileUpdateDetails } from 'src/@types/stallionList';
import { prepareAPIMutation } from "src/utils/customFunctions";

export const apiWithPatchStallionDetailsById = splitApi.injectEndpoints({
  endpoints: (build) => ({
    patchStallionDetailsById: build.mutation<
      ProfileUpdateDetails, Pick<ProfileUpdateDetails, 'stallionId'> & Partial<ProfileUpdateDetails>>({
        query: ({ stallionId, ...payload }) => (prepareAPIMutation(api.baseUrl, api.stallions + '/' + stallionId + '/profile', '', 'PATCH', payload, true)),
        invalidatesTags : ['stallionDetails', 'Currencies']
      }),
    patchStallionProfileOverview: build.mutation<
      any, Pick<any, 'stallionId'> & Partial<any>>({
        query: ({ stallionId, ...payload }) => (prepareAPIMutation(api.baseUrl, api.stallions + '/' + stallionId + '/overview', '', 'PATCH', payload, true)),
        invalidatesTags : ['stallionDetails']
      }),
    patchStallionHeroGalleryImage: build.mutation<
      any, Pick<any, 'stallionId'> & Partial<any>>({
        query: ({ stallionId, ...payload }) => (prepareAPIMutation(api.baseUrl, api.stallions + '/' + stallionId + api.galleryImage, '', 'PATCH', payload, true)),
        invalidatesTags : ['stallionGalleryimage']
      }),
    patchStallionProfileTestimonials: build.mutation<
    any, Pick<any, 'stallionId'> & Partial<any>>({
        query: ({ stallionId, ...payload }) => (prepareAPIMutation(api.baseUrl, api.stallions + '/' + stallionId + api.testimonialsUrl, '', 'PATCH', payload, true)),
        invalidatesTags: ['stallionTestimonials']
      }),
    postStallionProfileImageUpload: build.mutation<any, any>({
      query: (payload) => (prepareAPIMutation(api.baseUrl, api.stallions + '/' + payload?.stallionId + api.profileImageUpload, '', 'POST', payload, true)),
    }),
    postStallionProfileGalleryimageUpload: build.mutation<any, any>({
      query: (payload) => (prepareAPIMutation(api.baseUrl, api.stallions + '/' + payload?.stallionId + api.galleryImage, '', 'POST', payload, true)),
    }),
    postStallionProfileTestimonialsMediaUpload: build.mutation<any, any>({
      query: (payload) => (prepareAPIMutation(api.baseUrl, api.stallions + '/' + payload?.stallionId + api.stallionTestimonialsMediaUrl, '', 'POST', payload, true)),
    }),
  }),
});

export const { usePatchStallionDetailsByIdMutation,
  usePatchStallionProfileOverviewMutation,
  usePatchStallionHeroGalleryImageMutation,
  usePatchStallionProfileTestimonialsMutation,
  usePostStallionProfileImageUploadMutation,
  usePostStallionProfileGalleryimageUploadMutation,
  usePostStallionProfileTestimonialsMediaUploadMutation,
} = apiWithPatchStallionDetailsById;
