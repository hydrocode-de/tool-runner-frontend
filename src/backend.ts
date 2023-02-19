/* Connect to the tool-runner-js backend */

import axios from 'axios';
import { ToolConfig, listTools } from '@hydrocode/tool-runner'

// replace this with a Settings, as soon as connecting remote runner is possible
const API_URL = 'http://localhost:3000';

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

export const run = (tool: ToolConfig, args: any): Promise<string> => {
    return new Promise((resolve, reject) => {
        axios.get<{message: string, output: string}>(`${API_URL}/tools/${tool.name}/run`, {params: args}).then(res => {
            resolve(res.data.output)
        }).catch(err => reject(err))
    })
}