import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from "src/utils/customFunctions";

export const apiWithPostSignOutFromAllDevice = splitApi.injectEndpoints({
  endpoints: (build) => ({
    apiWithPostSignOutFromAllDevice: build.mutation<any, any>({
      query: (data: any) => (prepareAPIMutation(api.baseUrl, api.maresTableUrl, '', 'POST', data,true)),
    }),
  }),
});

export const {  useApiWithPostSignOutFromAllDeviceMutation} = apiWithPostSignOutFromAllDevice;