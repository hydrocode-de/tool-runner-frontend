import {  IonSpinner as Spinner } from "@ionic/core/components"
import { IonCol, IonGrid, IonNote, IonRow, IonSpinner } from "@ionic/react"

const LoadingScreen: React.FC<{message?: string, name?: Spinner['name']}> = ({ message, name }) => {
    return (
        <IonGrid style={{height: '100%'}}>
            <IonRow style={{height: '100%'}}>
                <IonCol className="ion-align-items-center ion-justify-content-center" style={{display: 'flex'}}>
                    <div style={{display: 'flex', flexDirection: 'column'}} className="ion-align-items-center">
                        <IonSpinner name={name ? name : 'crescent'} style={{fontSize: '5rem'}} />
                        <IonNote style={{marginTop: '0.6rem'}}>
                            { message ? message : 'Loading components...' }
                        </IonNote>
                    </div>
                </IonCol>
            </IonRow>
        </IonGrid>
    )
}

export default LoadingScreen