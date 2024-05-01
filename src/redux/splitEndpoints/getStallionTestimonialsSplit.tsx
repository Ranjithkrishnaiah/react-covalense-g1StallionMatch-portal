import { FavoriteList } from 'src/@types/lists';
import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIQuery } from 'src/utils/customFunctions';

export const apiWithgetStallionTestimonials = splitApi.injectEndpoints({
    endpoints: (build) => ({
        getTestimonials: build.query<any ,any>({
            query: (id : any) => (prepareAPIQuery(api.baseUrl, api.stallions+ '/' + id  + '/testimonials' , '',true)),
            keepUnusedDataFor: 0, 
        })
    })
});

export const { useGetTestimonialsQuery } = apiWithgetStallionTestimonials;