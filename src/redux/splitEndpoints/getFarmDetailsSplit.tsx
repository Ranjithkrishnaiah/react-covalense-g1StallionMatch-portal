import { api } from 'src/api/apiPaths';
import { prepareAPIQuery } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';

type TestimonialType = {
  mediaInfoId: string;
  title: string;
  description: string;
}
export const apiWithGetFarmDetailsSplit = splitApi.injectEndpoints({
    endpoints: (build) => ({
        getFarmDetails: build.query<any, string>({
          query: (farmId: string) =>  (prepareAPIQuery(api.baseUrl, api.farmsUrl + '/' + farmId, '')),
          providesTags: (result, error) => [{ type: 'farmDetails' }],
        }),
        getFarmGalleryimage: build.query<any, string>({
          query: (farmId: string) =>  (prepareAPIQuery(api.baseUrl, api.farmsUrl + '/' + farmId + api.galleryImage, '')),
          providesTags: (result, error) => [{ type: 'farmGalleryimage' }],
        }),
        getFarmMedias: build.query<any, string>({
          query: (farmId: string) =>  (prepareAPIQuery(api.baseUrl, api.farmsUrl + '/' +  farmId + api.farmMediaListUrl, '')),
          providesTags: (result, error) => [{ type: 'farmMedias' }],
        }),
      }),
    });
    
    export const { useGetFarmDetailsQuery, useGetFarmGalleryimageQuery, useGetFarmMediasQuery } = apiWithGetFarmDetailsSplit;
    