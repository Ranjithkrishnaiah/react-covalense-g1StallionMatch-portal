import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from "src/utils/customFunctions";

export const sendFinalOrders = splitApi.injectEndpoints({
  endpoints: (build) => ({
    postOrders : build.mutation<any, any>({
      query: (data: any) => (prepareAPIMutation(api.baseUrl, api.postOrdersUrl, '', 'POST', data,true)),
    }),
  }),
});

export const { usePostOrdersMutation } = sendFinalOrders;