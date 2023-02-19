import { ToolConfig } from "@hydrocode/tool-runner";
import { IonButton, IonCol, IonGrid, IonInput, IonItem, IonLabel, IonList, IonNote, IonRow, IonSelect, IonSelectOption, IonSpinner } from "@ionic/react";
import { useEffect, useState } from "react";

import { run } from '../backend'

const { REACT_APP_STEP_FOLDER } = process.env

// with > v0.2.3 this is exported by tool-runner
interface ParameterConfig {
    type: string;
    description?: string;
    values?: string[];
    min?: number;
    max?: number;
    optional?: boolean;
    default?: any;
    array?: boolean;
}

interface ParamInputProps {
    name: string,
    param: ParameterConfig,
    onUpdate: (key: string, value: any) => void
}

const ParamInput: React.FC<ParamInputProps> = ({ name, param, onUpdate }) => {
    let input: JSX.Element;
    const [error, setError] = useState<string>('')

    // add a function to handle file uploads
    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            // create a file reader
            const fs = new FileReader();
            fs.onload = e => {
                if (e.target) {
                    const { result } = e.target
                    resolve(result as string)
                } else {
                    reject('No file loaded')
                }
            }
            fs.readAsDataURL(file)
        })
    }

    // handler for updating the value
    const updateHandler = (value: any) => {
        if (param.type === 'file') {
            fileToBase64(value as File)
                .then(b64 => {
                    onUpdate(name, b64)
                    setError('')
                })
                .catch(err => setError(err))
        } else {
            if (value) {
                setError('')
                onUpdate(name, value)
            } else {
                if (!!param.optional) {
                    setError('No value set')
                }
            }
        }
    }

    // render the correct input element
    switch (param.type) {
        case 'integer':
            input = <IonInput type="number" step="1" {...{min: param.min, max: param.max}} onIonChange={e => updateHandler(Number(e.target.value))} />
            break;
        case 'float':
            input = <IonInput type="number" step="0.1" {...{min: param.min, max: param.max}} onIonChange={e => updateHandler(Number(e.target.value))} />
            break;
        case 'enum':
            input = (
                <IonSelect onIonChange={e => updateHandler(e.target.value)}>
                    { param.values?.map(v => <IonSelectOption key={v} value={v}>{ v }</IonSelectOption>) }
                </IonSelect>
            )
            break;
        case 'datetime' || 'date':
            input = <IonInput type="datetime-local" onIonChange={e => updateHandler(new Date(e.target.value!))} />
            break;
        case 'file':
            if (!window.FileReader) {
                input = <IonLabel color="warning">Safari Browser does not support FileReader, please just use Chrome...</IonLabel>
            } else {
                input = <input type="file" onChange={e => updateHandler(e.target.files![0])} />
            }
            break;
        default:
            input = <IonInput type="text" onIonChange={e => updateHandler(e.target.value)} />
            break;
    }

    // return the element
    return <>
        { input }
        { param.description ? <IonNote slot="helper">{ param.description }</IonNote> : null }
        { error !== '' ? <IonNote slot="error">{ error }</IonNote> : null }
    </>
}



const ToolRun: React.FC<{tool: ToolConfig}> = ({ tool }) => {
    // create a state to store the args
    const [args, setArgs] = useState<{[key: string]: any}>({})
    const [status, setStatus] = useState<'pending' | 'invalid' | 'running' | 'finished' | 'errored'>('invalid')
    const [message, setMessage] = useState<string>('')

    // callback function to update the args
    const updateArgs = (key: string, value: any) => {
        const newArgs = {...args}
        newArgs[key] = value
        setArgs(newArgs)
    }

    // run Function
    const startTool = () => {
        // set stauts
        setStatus('running')
        
        // setting the path here, should be moved to the server
        run(tool, {...args, resultPath: REACT_APP_STEP_FOLDER}).then(output => {
            setMessage(output)
            setStatus('finished')
        })

    }

    // check the args as they have been updated
    useEffect(() => {
        const valid = Object.keys(tool.parameters).every(parName => {
            // The parameter is either optional or it's included in args
            return !!tool.parameters[parName].optional || Object.keys(args).includes(parName)
        })

        // update the status
        setStatus(valid ? 'pending' : 'invalid')

        // dev only 
        console.log(args)
    }, [args])

    if (status === 'pending' || status === 'invalid') {
        return <>
            <IonList>
                { Object.entries(tool.parameters).map(([parName, param]) => {
                    return (
                        <IonItem key={parName}>
                            <IonLabel position="fixed">{ parName }</IonLabel>
                            <ParamInput name={parName} param={param} onUpdate={updateArgs} />
                        </IonItem>
                    )
                }) }

                <IonButton fill="solid" expand="full" color="success" disabled={status==='invalid'} onClick={startTool}>RUN</IonButton>
            </IonList>
        </>
    }

    if (status === 'running') {
        return <>
            <IonGrid style={{height: '100%'}}>
                <IonRow style={{height: '100%'}}>
                    <IonCol className="ion-align-items-center ion-justify-content-center" style={{display: 'flex'}}>
                        <div style={{display: 'flex', flexDirection: 'column'}} className="ion-align-items-center">
                            <IonSpinner name="crescent" style={{fontSize: '5rem'}} />
                            <IonNote>The tool is currently running</IonNote>
                        </div>
                    </IonCol>
                </IonRow>
            </IonGrid>
        </>
    }

    return <>
        <IonItem color={status === 'finished' ? 'success' : 'danger'}>
            <IonLabel>Calculation { status === 'finished' ? 'finished.' : 'errored.'}</IonLabel>
        </IonItem>
        <IonItem>
            <pre>
                <code>
                    { message }
                </code>
            </pre>
        </IonItem>
        <IonButton expand="full" routerLink="/tools" routerDirection="root" >GO BACK</IonButton>
    </>
}

export default ToolRun