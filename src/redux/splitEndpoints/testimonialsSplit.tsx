import { CustomerTestimonials } from 'src/@types/Testimonials';
import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIQuery } from "src/utils/customFunctions";

export const apiWithTestimonials = splitApi.injectEndpoints({
  endpoints: (builder) => ({
    testimonials: builder.query<CustomerTestimonials[], void>({
      query: () => prepareAPIQuery(api.baseUrl, api.testimonials +'/home', ''),
      providesTags: (result, error) => [{ type: 'testimonials' }],
    }),
  }),
});

export const { useTestimonialsQuery } = apiWithTestimonials;
