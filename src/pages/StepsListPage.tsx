import { useEffect, useState } from "react"
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonGrid, IonNote, IonRow, IonSpinner } from "@ionic/react"
import { StepPreview } from "@hydrocode/tool-runner"

import StepsList from "../components/StepsList"
import { getSteps } from '../backend'


const StepsListPage: React.FC = () => {
    const [steps, setSteps] = useState<StepPreview[]>([])
    const [status, setStatus] = useState<'loading' | 'done'>('loading')
    const [error, setError] = useState<string>('')

    // load the steps 
    useEffect(() => {
        getSteps()
            .then(steps => setSteps(steps))
            .catch(err => setError(err))
            .finally(() => setStatus('done'))
    }, [])

    // loading
    if (status === 'loading') {
        return (
            <IonGrid style={{height: '100%'}}>
                    <IonRow style={{height: '100%'}}>
                        <IonCol className="ion-align-items-center ion-justify-content-center" style={{display: 'flex'}}>
                            <div style={{display: 'flex', flexDirection: 'column'}} className="ion-align-items-center">
                                <IonSpinner name="crescent" style={{fontSize: '5rem'}} />
                                <IonNote style={{marginTop: '0.6rem'}}>The STEP result files are loaded...</IonNote>
                            </div>
                        </IonCol>
                    </IonRow>
            </IonGrid>
        )
    }

    // error rendering
    if (error != '') {
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

    // render
    return <>
        <StepsList steps={steps} />
    </>

}

export default StepsListPage