import { api } from 'src/api/apiPaths';
import { prepareAPIQuery, prepareHeaders } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';
const BaseAPI = process.env.REACT_APP_HOST_API_KEY;

//Needs to be reimplemented once the api is provided
export const apiWithgetMessageMediaId = splitApi.injectEndpoints({
  endpoints: (build) => ({
    getMessageMediaId: build.query({
      queryFn: async ({ mediaId, mediaDownloadType }, api, extraOptions, baseQuery) => {
        const result: any = await baseQuery({
          url:
            BaseAPI +
            '/v1' +
            '/message' +
            '/media/' +
            mediaId +
            '?mediaDownloadType=' +
            mediaDownloadType,
          headers: prepareHeaders(),
          responseHandler: (response) => response.blob(),
        });

        const tempUrl = URL.createObjectURL(result.data);
        return { data: tempUrl };
      },
    }),
    getMessageMediaDocs: build.query({
      queryFn: async ({ mediaId, mediaDownloadType, mediaFileName }, api, extraOptions, baseQuery) => {
        const result: any = await baseQuery({
          url:
            BaseAPI +
            '/v1' +
            '/message' +
            '/media/' +
            mediaId +
            '?mediaDownloadType=' +
            mediaDownloadType,
          headers: prepareHeaders(),
          responseHandler: (response) => response.blob(),
        });

        var hiddenElement = document.createElement('a');
        var url = window.URL || window.webkitURL;
        var blobPDF = url.createObjectURL(result?.data);
        hiddenElement.href = blobPDF;
        hiddenElement.target = '_blank';
        hiddenElement.download = `${mediaFileName}`;
        hiddenElement.click();
        return { data: null };
      },
    }),
  }),
});

export const { useGetMessageMediaIdQuery, useGetMessageMediaDocsQuery } = apiWithgetMessageMediaId;
