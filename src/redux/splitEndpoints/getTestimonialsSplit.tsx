import { FavoriteList } from 'src/@types/lists';
import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIQuery } from 'src/utils/customFunctions';

export const apiWithgetTestimonials = splitApi.injectEndpoints({
    endpoints: (build) => ({
        getTestimonials: build.query<any ,void>({
            query: () => (prepareAPIQuery(api.baseUrl, api.testimonialsUrl, '')),
            keepUnusedDataFor: 0, 
            providesTags: (result, error) => [{ type: 'Testimonials' }],
        })
    })
});

export const { useGetTestimonialsQuery } = apiWithgetTestimonials;