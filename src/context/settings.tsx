import React, { createContext, useContext, useState } from "react"

interface SettingsState {
    backendUrl: string,
    backendOnline: boolean
}

const initialState: SettingsState = {
    backendUrl: 'http://localhost:3000',
    backendOnline: false
}

// build the context
const SettingsContext = createContext(initialState)

export const SettingsProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    // context state
    const [backendUrl, setBackendUrl] = useState<string>(initialState.backendUrl)
    const [backendOnline, setBackendOnline] = useState<boolean>(initialState.backendOnline)
    
    // build the context value
    const value = {
        backendUrl,
        backendOnline
    }

    // return 
    return <>
        <SettingsContext.Provider value={value}>
            { children }
        </SettingsContext.Provider>
    </>
}

// create a hook 
export const useSettings = () => {
    return useContext(SettingsContext);
}