import { createContext } from 'react';
import { ReactChildProp } from 'src/@types/typeUtils';
import { ROUTES } from 'src/routes/paths';


type API_METHODS = {
    GET: string;
    POST: string;
    PUT: string;
    DELETE: string;
}

type ROUTES = {
    ROOT: string;
    LOGIN: string;
    REGISTER: string;
    RESET_PASSWORD: string;
    DASHBOARD: string;
    STALLION_MATCH: string;
    FARMS: string;
    DIRECTORY: string;
    TRENDS: string;
    REPORTS: string;
    PRIVACY_POLICY: string;
    TERMS_AND_CONDITIONS: string;
    HELP: string;
    CONTACT_US: string;
    PAGE_NOT_FOUND: string;
}

const GlobalValuesContext = createContext<Object | {}>({})

export const GlobalValuesProvider = ({ children }: ReactChildProp) => {
    const API_METHODS: API_METHODS = {
        GET: 'get',
        POST: 'post',
        PUT: 'put',
        DELETE: 'delete'
    }
    return(
        <GlobalValuesContext.Provider value = { { API_METHODS, ROUTES } }>
            { children }
        </GlobalValuesContext.Provider>
    )
}

export default GlobalValuesContext