import { MyFarm } from 'src/@types/lists';
import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from 'src/utils/customFunctions';

export const deleteMessage = splitApi.injectEndpoints({
  endpoints: (build) => ({
    deleteMessage: build.mutation<any, object>({
      query: (obj) => prepareAPIMutation(api.baseUrl, api.messagesUrl, '', 'DELETE', obj, true),
      invalidatesTags: ['DeleteMessage', 'MessageFarmList', 'getEnquiredFarms'],
    }),
  }),
});

export const { useDeleteMessageMutation } = deleteMessage;
