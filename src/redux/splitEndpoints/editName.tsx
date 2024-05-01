import { Name } from 'src/@types/profile';
import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from "src/utils/customFunctions";

export const editName = splitApi.injectEndpoints({
  endpoints: (build) => ({
    editName: build.mutation<Name, Name>({
      query: (name) => (
        prepareAPIMutation(api.baseUrl, api.editNameUrl, '', 'PATCH', name, true)
        ),
        invalidatesTags: ['profileDetails']
    }),
  }),
});

export const { useEditNameMutation } = editName;
