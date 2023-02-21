import { useEffect, useState } from "react"
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonGrid, IonNote, IonPage, IonRow, IonSpinner } from "@ionic/react"
import { StepPreview } from "@hydrocode/tool-runner"

import StepsList from "../components/StepsList"
import { getSteps } from '../backend'
import { RouteComponentProps } from "react-router"
import LoadingScreen from "../components/LoadingScreen"
import ErrorMessage from "../components/ErrorMessage"


const StepsListPage: React.FC<RouteComponentProps<{toolName?: string}>> = ({ match }) => {
    const [steps, setSteps] = useState<StepPreview[]>([])
    const [status, setStatus] = useState<'loading' | 'finished'>('loading')
    const [error, setError] = useState<string>('')

    // load the steps 
    useEffect(() => {
        setStatus('loading')
        getSteps()
            .then(steps => setSteps(steps))
            .catch(err => setError(err))
            .finally(() => setStatus('finished'))
    }, [match.params.toolName])

    // render
    return (
        <IonPage>
            <IonContent fullscreen>
                { status === 'loading' ? <LoadingScreen message="The STEP result files are loaded..." /> : null }
                { status === 'finished' && error !== '' ? <ErrorMessage message={error} /> : <StepsList steps={steps} /> }
            </IonContent>
        </IonPage>
    ) 
}

export default StepsListPage