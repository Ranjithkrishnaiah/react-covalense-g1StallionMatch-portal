import { api } from 'src/api/apiPaths';
import { prepareAPIMutation, prepareAPIQuery } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';

type ValidationResponse = {
  isValid: boolean;
//   errors?:{hash: string}
};

type Hash = {
  hash: string;
};

export const mailPreview = splitApi.injectEndpoints({
  endpoints: (build) => ({
    mailPreview: build.query<any, any>({
      query: (obj: any) => prepareAPIQuery(api.baseUrl, api.mailPreview + obj.dirIdentity +'/'+ obj.fileIdentity, ''),
    })
  }),
});

export const { useMailPreviewQuery } = mailPreview;
