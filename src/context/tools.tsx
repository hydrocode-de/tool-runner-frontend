import { ToolConfig } from "@hydrocode/tool-runner";
import React, { createContext, useContext, useEffect, useState } from "react";
import { getTools } from "../backend";

interface ToolsState {
    tools: ToolConfig[],
    status: 'loading' | 'pending' | 'errored',
    lastError: string
}

const initialState: ToolsState = {
    tools: [],
    status: 'loading',
    lastError: ''
}

// build the context
const ToolsContext = createContext(initialState)

export const ToolsProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    // create the component state
    const [tools, setTools] = useState<ToolConfig[]>(initialState.tools)
    const [status, setStatus] = useState<typeof initialState.status>(initialState.status)
    const [lastError, setLastError] = useState<string>(initialState.lastError)
    
    // load the tools on first load
    useEffect(() => {
        getTools()
            .then(tools => {
                setTools(tools)
                setStatus('pending')
            })
            .catch(err => {
                setStatus('errored')
                setLastError(err)
            })
    }, [])

    // build the context value
    const value = {
        tools,
        status,
        lastError
    }

    // return
    return <>
        <ToolsContext.Provider value={value}>
            { children }
        </ToolsContext.Provider>
    </>
}

// create a hook
export const useTools = () => {
    return useContext(ToolsContext);
}