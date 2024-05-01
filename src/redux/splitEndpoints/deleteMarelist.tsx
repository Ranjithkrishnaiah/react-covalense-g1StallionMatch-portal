import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from 'src/utils/customFunctions';

export const deleteMareList = splitApi.injectEndpoints({
  endpoints: (build) => ({
    deleteMareList: build.mutation<any, any>({
      query: (str: any[]) => prepareAPIMutation(api.baseUrl, api.postMareListsUrl + '/' + str[0], '', 'DELETE',{id:str[0], farmId: str[1]}, true),
      invalidatesTags: ['Get MareLists CSV'],
    }),
  }),
});

export const { useDeleteMareListMutation } = deleteMareList;
