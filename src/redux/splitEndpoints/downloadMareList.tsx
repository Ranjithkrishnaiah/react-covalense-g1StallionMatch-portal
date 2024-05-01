import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIQuery } from 'src/utils/customFunctions';

export const downLoadMareList = splitApi.injectEndpoints({
  endpoints: (build) => ({
    downLoadMareList: build.query<any, any>({
      query: (arr: any) => prepareAPIQuery(api.baseUrl, api.postMareListsUrl + '/download/' + arr[0] + '?farmId='+ arr[1], '', true),
      providesTags: [{type:'Download MareList'}],
    }),
  }),
});

export const { useDownLoadMareListQuery } = downLoadMareList;
