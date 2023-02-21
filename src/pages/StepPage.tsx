import { StepContent } from "@hydrocode/tool-runner";
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonGrid, IonNote, IonPage, IonRow, IonSpinner } from "@ionic/react";
import { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";

import { getStep } from '../backend'
import ErrorMessage from "../components/ErrorMessage";
import LoadingScreen from "../components/LoadingScreen";
import StepDetail from "../components/StepDetail";

const StepPage: React.FC<RouteComponentProps<{toolName?: string, stepName: string, action?: string}>> = ({ match }) => {
    const [step, setStep] = useState<StepContent>()
    const [status, setStatus] = useState<'loading' | 'finished'>('loading')
    const [error, setError] = useState<string>('')

    // load the step
    useEffect(() => {
        // set loading status
        setStatus('loading')

        // get the data
        getStep(match.params.stepName)
            .then(value => setStep(value))
            .catch(err => setError(err))
            .finally(() => setStatus('finished'))
        
    }, [match.params.stepName])

    return (
        <IonPage>
            <IonContent fullscreen>
                { status === 'loading' ? <LoadingScreen message="The results are loaded from the backend..." /> : null }
                { status === 'finished' && error !== '' ? <ErrorMessage message={error}/> : null }
                { status === 'finished' && step ?  <StepDetail step={step} /> : null }
            </IonContent>
        </IonPage>
    )
}

export default StepPage;