import { ToolConfig } from "@hydrocode/tool-runner";
import { IonAccordion, IonAccordionGroup, IonButton, IonCol, IonGrid, IonInput, IonItem, IonLabel, IonList, IonNote, IonRow, IonSelect, IonSelectOption, IonSpinner, IonTitle, IonToggle } from "@ionic/react";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";

import { run } from '../backend'


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
    args: {[key: string]: any},
    onUpdate: (key: string, value: any) => void
}

const ParamInput: React.FC<ParamInputProps> = ({ name, param, args, onUpdate }) => {
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

                    // rebuild the data-url
                    const b64 = (result as string).split(';base64,').pop() 
                    const mime = file.name.split('.').slice(1).join('.')

                    // this is a bit messy
                    const type = ['txt', 'csv', 'dat', 'html'].includes(mime) ? 'text' : 'application'

                    resolve(`data:${type}/${mime};base64,${b64}`)
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
            if (value || param.type === 'bool') {
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
            input = <IonInput type="number" step="1" {...{min: param.min, max: param.max}} onIonChange={e => updateHandler(Number(e.target.value))} value={args[name]} />
            break;
        case 'float':
            input = <IonInput type="number" step="0.1" {...{min: param.min, max: param.max}} onIonChange={e => updateHandler(Number(e.target.value))} value={args[name]} />
            break;
        case 'enum':
            input = (
                <IonSelect onIonChange={e => updateHandler(e.target.value)} value={args[name]}>
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
        case 'bool':
            input = <IonToggle slot="end" onIonChange={e => updateHandler(Boolean(e.target.checked))} value={args[name] || false} />
            // input = <IonToggle slot="end" onIonChange={e => console.log(e.target.checked)} />
            break;
        default:
            input = <IonInput type="text" value={args[name]} onIonChange={e => updateHandler(e.target.value)} />
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
    // transform 
    const opt = Object.fromEntries(Object.entries(tool.parameters).filter(([_, param]) => param.default).map(([parName, param]) => [parName, param.default]))
    // create a state to store the args
    const [args, setArgs] = useState<{[key: string]: any}>(opt)
    const [status, setStatus] = useState<'pending' | 'invalid' | 'running' | 'finished' | 'errored'>('invalid')
    const [message, setMessage] = useState<string>('')

    // load the history package
    const history = useHistory()

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
        
        // run - this is the sync option. Keep this handler for the async option
        run(tool, {...args}).then(output => {
            setMessage(output)
            setStatus('finished')
        })

    }

    // check for the status being 'finished'
    useEffect(() => {
        if (status === 'finished') {
            // TODO - this is not great, as message is the file name right now
            history.push(`/steps/${message}`)
        }
    }, [status])

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
                { Object.entries(tool.parameters)
                    .filter(([_, param]) => !param.optional)
                    .map(([parName, param]) => {
                    return (
                        <IonItem key={parName}>
                            <IonLabel position="fixed">{ parName }</IonLabel>
                            <ParamInput name={parName} param={param} onUpdate={updateArgs} args={args} />
                        </IonItem>
                    )
                }) }
            </IonList>
            
            <IonAccordionGroup>
                <IonAccordion>
                    <IonItem slot="header">
                        <IonTitle>Optional Arguments</IonTitle>
                    </IonItem>
                    <IonList slot="content">
                        { Object.entries(tool.parameters)
                            .filter(([_, param]) => param.optional)
                            .map(([parName, param]) => {
                                return (
                                    <IonItem key={parName}>
                                        <IonLabel position="fixed">{ parName }</IonLabel>
                                        <ParamInput name={parName} param={param} onUpdate={updateArgs} args={args} />
                                    </IonItem>
                                )
                            }) }
                    </IonList>
                </IonAccordion>
            </IonAccordionGroup>

                <IonButton fill="solid" expand="full" color="success" disabled={status==='invalid'} onClick={startTool}>RUN</IonButton>
            
        </>
    }

    if (status === 'running') {
        return <>
            <IonGrid style={{height: '100%'}}>
                <IonRow style={{height: '100%'}}>
                    <IonCol className="ion-align-items-center ion-justify-content-center" style={{display: 'flex'}}>
                        <div style={{display: 'flex', flexDirection: 'column'}} className="ion-align-items-center">
                            <IonSpinner name="crescent" style={{fontSize: '5rem'}} />
                            <IonNote style={{marginTop: '0.6rem'}}>The tool is currently running</IonNote>
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