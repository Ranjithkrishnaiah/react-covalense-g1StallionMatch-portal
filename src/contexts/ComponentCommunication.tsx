import { useState, createContext } from 'react';
import { ReactChildProp } from '../@types/typeUtils'

//TO DO : Find the proper type for below context

type DeleteItemDetails = {
    id: string;
    name: string;
    listName: string;
}
const ComponentCommunicationContext = createContext<any | undefined>({})

export const CommunicationProvider = ({ children }: ReactChildProp) => {
    const [ stallionsShortlisted, setStallionsShortlisted ] = useState([]);
    const [ headerBackground, setHeaderBackground ] = useState(false);
    const [ openSignup, setOpenSignup ] = useState(false);
    const [ openDeleteConfirmation, setOpenDeleteConfirmation ] = useState(false);
    const [ deleteItemDetails, setDeleteItemDetails ] = useState<DeleteItemDetails>({} as DeleteItemDetails)
    return(
        <ComponentCommunicationContext.Provider value = {
            { 
                stallionsShortlisted, setStallionsShortlisted,
                headerBackground, setHeaderBackground,
                openSignup, setOpenSignup , 
                openDeleteConfirmation, setOpenDeleteConfirmation,
                deleteItemDetails, setDeleteItemDetails,
            } }>
            {children}
        </ComponentCommunicationContext.Provider>
    )
}

export default ComponentCommunicationContext