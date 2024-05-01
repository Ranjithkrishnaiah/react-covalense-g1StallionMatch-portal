import { api } from 'src/api/apiPaths';
import { prepareAPIQuery } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';

export const apiWithGetStallionDetails = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getStallionDetails: build.query<any, any>({
      query: (obj: any) =>  (prepareAPIQuery(api.baseUrl, api.stallionDetailsURL + '/' + obj?.stallionId , obj?.country ? '?countryName='+obj?.country :'')),
      providesTags: (result, error) => [{ type: 'stallionDetails' }],
    }),
    getStallionGalleryimage: build.query<any, string>({
      query: (stallionId: string) =>  (prepareAPIQuery(api.baseUrl, api.stallionDetailsURL + '/' + stallionId + api.galleryImage, '')),
      providesTags: (result, error) => [{ type: 'stallionGalleryimage' }],
    }),
    getStallionTestimonials: build.query<any, void>({
      query: (stallionId: any) =>  (prepareAPIQuery(api.baseUrl, api.stallionDetailsURL + '/' +  stallionId + api.testimonialsUrl, '')),
      providesTags: (result, error) => [{ type: 'stallionTestimonials' }],
    }),
  }),
});

export const { useGetStallionDetailsQuery, useGetStallionGalleryimageQuery, useGetStallionTestimonialsQuery } = apiWithGetStallionDetails;
