import { useState, createContext } from 'react';
import { ReactChildProp } from '../@types/typeUtils'

//TO DO : Find the proper type for below context
const DummyAuthContext = createContext<any | undefined>({})

export const DummyAuthProvider = ({ children }: ReactChildProp) => {
    const [isDummyAuthenticated, setIsDummyAuthenticated] = useState<boolean>(false)
    const [user, setUser] = useState<Object | null>(null)
    return(
        <DummyAuthContext.Provider value = { { isDummyAuthenticated, setIsDummyAuthenticated, user, setUser } }>
            {children}
        </DummyAuthContext.Provider>
    )
}

export default DummyAuthContext