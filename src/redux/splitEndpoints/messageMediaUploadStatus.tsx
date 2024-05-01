import React from 'react';
import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from 'src/utils/customFunctions';

export const apiWithMessageMediaUploadStatus = splitApi.injectEndpoints({
  endpoints: (build) => ({
    messageMediaUploadStatus: build.mutation<any, any>({
      query: (mediauuid) =>
        prepareAPIMutation(api.baseUrl, api.mediaUploadStatusUrl, '', 'POST', mediauuid, true),
        invalidatesTags: ['AllMessages'],
    }),
  }),
});
export const { useMessageMediaUploadStatusMutation } = apiWithMessageMediaUploadStatus;
