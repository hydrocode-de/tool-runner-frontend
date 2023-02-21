import { StepContent } from "@hydrocode/tool-runner";
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonGrid, IonNote, IonPage, IonRow, IonSpinner } from "@ionic/react";
import { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";

import { getStep } from '../backend'
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

    // loading
    if (status === 'loading') {
        return (
            <IonGrid style={{height: '100%'}}>
                    <IonRow style={{height: '100%'}}>
                        <IonCol className="ion-align-items-center ion-justify-content-center" style={{display: 'flex'}}>
                            <div style={{display: 'flex', flexDirection: 'column'}} className="ion-align-items-center">
                                <IonSpinner name="crescent" style={{fontSize: '5rem'}} />
                                <IonNote style={{marginTop: '0.6rem'}}>The results are loaded from the backend...</IonNote>
                            </div>
                        </IonCol>
                    </IonRow>
            </IonGrid>
        )
    }

    // error rendering
    if (error != '' || !step) {
        return <>
            <IonCard color="danger">
                <IonCardHeader>
                    <IonCardTitle>Backend error occured</IonCardTitle>
                    <IonCardContent>
                        { error }
                    </IonCardContent>
                    <IonButton color="light" fill="clear" routerLink="/" routerDirection="root">BACK</IonButton>
                </IonCardHeader>
            </IonCard>
        </>
    }

    return (
        <IonPage>
            <IonContent fullscreen>
                <StepDetail step={step} />
            </IonContent>
        </IonPage>
    )
}

export default StepPage;