import { api } from 'src/api/apiPaths';
import { prepareAPIMutation } from 'src/utils/customFunctions';
import { splitApi } from '../rootMiddleware';

export const apiWithaddRemoveReasonSubmit = splitApi.injectEndpoints({
    endpoints: (build) =>({
        addRemoveReasonSubmit: build.mutation<any,any>({
            query: data => (prepareAPIMutation(api.baseUrl, api.stallions +  api.stallionReasonsSubmitUrl +'/'+ data?.stallionId+'/'+data?.reasonId, '', 'POST','',true)),
            invalidatesTags: ['stallionRoster']
        })
    })
});

export const { useAddRemoveReasonSubmitMutation } = apiWithaddRemoveReasonSubmit;