import { StepPreview, ToolConfig } from "@hydrocode/tool-runner"
import { IonBackButton, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonContent, IonHeader, IonItem, IonPage, IonTitle, IonToolbar, isPlatform } from "@ionic/react"
import { useEffect, useState } from "react"
import { Redirect, RouteComponentProps } from "react-router"
import { getSteps } from "../backend"
import ErrorMessage from "../components/ErrorMessage"
import LoadingScreen from "../components/LoadingScreen"
import StepsList from "../components/StepsList"
import ToolRun from "../components/ToolRun"
import { useTools } from "../context/tools"

const ALLOWED_ACTIONS = ['run', 'steps']

const ToolPage: React.FC<RouteComponentProps<{toolName: string, action: string}>> = ({ match }) => {
    // component state
    const [tool, setTool] = useState<ToolConfig>()
    const [error, setError] = useState<string>('')
    const [steps, setSteps] = useState<StepPreview[]>([])

    // use the tools context
    const { tools, status, lastError } = useTools()
    
    // get the requested tool and the requested action
    const { toolName, action} = match.params
    
    // load the correct tool
    useEffect(() => {
        if (status === 'pending') {
            const tool = tools.find(t => t.name === toolName)
            if (tool) {
                setTool(tool)
                setError('')
            } else {
                setTool(undefined)
                setError(`The tool '${toolName}' could not be found.`)
            }
        }
        
    }, [status, toolName])

    // handle errors coming from the context
    useEffect(() => {
        if (status === 'errored') {
            setError(lastError)
        }
    }, [status, lastError]) 
    
    // handle the actions
    useEffect(() => {
        if (!ALLOWED_ACTIONS.includes(action)) {
            setError(`Action '${action}' is unkown. Allowed actions are: [${ALLOWED_ACTIONS.join(', ')}]`)
        }
        if (action === 'steps') {
            getSteps({toolName: toolName})
                .then(s => setSteps(s))
                .catch(e => setError(e))
        } else {
            setSteps([])
        }
    }, [action])

    // otherwise render the actual page
    return <>
        <IonPage>

            { isPlatform('electron') ? null : (
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonBackButton />
                        </IonButtons>
                        <IonTitle>
                            {action === 'run' ? 'RUN - ': null}{ tool ? tool.title : 'Waiting...' }
                            {action === 'steps' ? ' - Results' : null}
                        </IonTitle>
                    </IonToolbar>
                </IonHeader>
            )}

            <IonContent fullscreen>
                { status === 'loading' ? <LoadingScreen message="Talking to your Docker daemon. Seems to be a nice guy..." /> : null }
                { status === 'errored' ? <ErrorMessage message={error} /> : null }
                { action === 'run' && tool ? <ToolRun tool={tool} /> : null }
                { action === 'steps' && error === '' ? <StepsList steps={steps} /> : null}
            </IonContent>
        </IonPage>
    </>
}

export default ToolPage