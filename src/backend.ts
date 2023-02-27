/* Connect to the tool-runner-js backend */

import axios from 'axios';
import { ToolConfig, StepPreview, StepContent, DockerHealth } from '@hydrocode/tool-runner'

// replace this with a Settings, as soon as connecting remote runner is possible
const API_URL = 'http://localhost:3000';
export type BACKEND_STATUS = 'online' | 'offline' | 'nodocker'

export const healthCheck = async (backendUrl: string): Promise<BACKEND_STATUS> => {
    const status = await axios.get<DockerHealth>(`${backendUrl}/healthz`)
        .then(res => res.data.running ? 'online' : 'nodocker')
        .catch(() => 'offline')

    return new Promise(resolve => resolve(status as BACKEND_STATUS))
}

export const getTools = (): Promise<ToolConfig[]> => {
    return new Promise((resolve, reject) => {
        // connect API
        axios.get<{count: number, tools: ToolConfig[]}>(`${API_URL}/tools`).then(res => {
            resolve(res.data.tools)
        }).catch(err => {
            reject(err)
        })
    })
}

export const getSteps = (filter: {toolName?: string} ={}): Promise<StepPreview[]> => {
    return new Promise((resolve, reject) => {
        // connect
        axios.get<{count: number, steps: StepPreview[]}>(`${API_URL}/steps`, {params: filter}).then(res => {
            resolve(res.data.steps)
        }).catch(err => reject(err))
    })
}

export const getStep = (stepName: string, files?: string[]): Promise<StepContent> => {
    return new Promise((resolve, reject) => {
        axios.get<StepContent>(`${API_URL}/steps/${stepName}`, {params: {...(files && {file: files})}}).then(res => {
            resolve({...res.data, metadata: {...res.data.metadata, stepName}})
        }).catch(err => reject(err))
    })
}

export const run = (tool: ToolConfig, args: any): Promise<string> => {
    return new Promise((resolve, reject) => {
        axios.get<{message: string, output: string}>(`${API_URL}/tools/${tool.name}/run`, {params: args}).then(res => {
            resolve(res.data.output)
        }).catch(err => reject(err))
    })
}