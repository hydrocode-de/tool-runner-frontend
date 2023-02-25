import React, { createContext, useContext, useEffect, useState } from "react"
import { getPlatforms } from "@ionic/react"

import { healthCheck, BACKEND_STATUS } from '../backend'
import { useInterval } from '../hooks/interval'


export type PLATFORM = ReturnType<typeof getPlatforms>[0]


interface SettingsState {
    backendUrl: string,
    backendStatus: BACKEND_STATUS,
    platforms: PLATFORM[],
    status: 'checking' | 'pending'
}

const initialState: SettingsState = {
    backendUrl: 'http://localhost:3000',
    backendStatus: 'offline',
    platforms: getPlatforms(),
    status: 'pending'
}

// build the context
const SettingsContext = createContext(initialState)

export const SettingsProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    // context state
    const [backendUrl, setBackendUrl] = useState<string>(initialState.backendUrl)
    const [backendStatus, setBackendStatus] = useState<BACKEND_STATUS>(initialState.backendStatus)
    const [status, setStatus] = useState<'checking' | 'pending'>(initialState.status)

    // check if the backend is there
    useEffect(() => {
        setStatus('checking')
        healthCheck(backendUrl).then(status => setBackendStatus(status))
        .finally(() => setStatus('pending'))
    }, [backendUrl])

    // setup a status checker
    useInterval(() => {
        console.log('checking...')
        setStatus('checking')
        healthCheck(backendUrl)
            .then(status => status !== backendStatus ? setBackendStatus(status) : null)
            .finally(() => setStatus('pending'))
    }, backendStatus === 'online' ? 60 * 1000 : 1000)

    // build the context value
    const value = {
        backendUrl,
        backendStatus,
        status,
        platforms: initialState.platforms
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