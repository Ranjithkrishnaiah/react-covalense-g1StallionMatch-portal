import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from 'src/utils/customFunctions';

export const editMarelistName = splitApi.injectEndpoints({
  endpoints: (builder) => ({
    patchNewMarelistName: builder.mutation<any, any>({
      query: (data) =>{
        // console.log("DDD: ", data)
       return( prepareAPIMutation(
          api.baseUrl,
          api.postMareListsUrl + '/'+ data[0],
          '',
          'PATCH',
          { 
            listname: data[1],
            farmId: data[2]
          },
          true
        ))},
      invalidatesTags: ['Get MareLists CSV'],
    }),
  }),
});

export const { usePatchNewMarelistNameMutation } = editMarelistName;
