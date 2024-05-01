import { api } from 'src/api/apiPaths';
import { splitApi } from '../rootMiddleware';
import { prepareAPIMutation } from "src/utils/customFunctions";
import { UpdateEmailSchema } from '../../forms/UpdateEmail'

export const apiWithUpdateEmail = splitApi.injectEndpoints({
    endpoints: (build) =>({
        updateEmail: build.mutation<any,UpdateEmailSchema>({
            query: newEmail => prepareAPIMutation(api.baseUrl, api.updateEmailUrl, '', 'PUT', newEmail),
        })
    })
  });

  export const { useUpdateEmailMutation } = apiWithUpdateEmail;
  