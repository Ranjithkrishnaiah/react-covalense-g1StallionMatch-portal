import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from "src/utils/customFunctions";

export const postMareListsCSV = splitApi.injectEndpoints({
  endpoints: (build) => ({
    postMareLists : build.mutation<any, any>({
      query: (data) =>{ 
        // console.log("FID In API:", data)
        return (prepareAPIMutation(api.baseUrl, api.postMareListsUrl+'/'+data[0], '', 'POST', data[1],true))},
      invalidatesTags: ['Get MareLists CSV']
    }),
  }),
});

export const { usePostMareListsMutation } = postMareListsCSV;