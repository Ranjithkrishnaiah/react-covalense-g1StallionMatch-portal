import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIQuery } from 'src/utils/customFunctions';

export const downLoadMareListTemplate = splitApi.injectEndpoints({
  endpoints: (build) => ({
    downLoadMareListTemplate: build.query<any, any>({
      query: (str: string) => prepareAPIQuery(api.baseUrl, api.getMareListTemplateUrl, '', true),
      providesTags: [{type:'Download MareList Template'}],
    }),
  }),
});

export const { useDownLoadMareListTemplateQuery } = downLoadMareListTemplate;
