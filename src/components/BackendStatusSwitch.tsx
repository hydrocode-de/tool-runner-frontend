import React from "react"
import { IonAccordion, IonAccordionGroup, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonGrid, IonItem, IonLabel, IonPage, IonRow, IonSpinner } from "@ionic/react"
import { isPlatform } from "@ionic/react"

import { useSettings } from "../context/settings"


const BackendStatusSwitch: React.FC<React.PropsWithChildren> = ({ children }) => {
    // get the settings module
    const { backendStatus, backendUrl, status } = useSettings()
    
    if (backendStatus === 'online') {
        return <>{ children }</>
    }

    return (
        <IonPage>
            <IonContent fullscreen>
                <IonGrid style={{height: '100%'}}>
                <IonRow style={{height: '100%'}}>
                    <IonCol className="ion-align-items-center ion-justify-content-center" style={{display: 'flex'}}>
                        <div style={{display: 'flex', flexDirection: 'column'}} className="ion-align-items-center">
                            <IonCard style={{maxWidth: '600px'}}>
                                <IonCardHeader>
                                    <IonCardTitle>No backend found</IonCardTitle>
                                </IonCardHeader>
                                <IonCardContent>
                                <IonItem>
                                        <IonLabel slot="start"><code>Status: </code></IonLabel>
                                        { status === 'checking' ? <IonSpinner name="dots" slot="end" /> : null }
                                        <IonLabel>{ status === 'pending' ? <code>{backendStatus}</code> : '-' }</IonLabel>
                                    </IonItem>
                                    { backendStatus === 'nodocker' ? (
                                        <p>A running backend was found, but no Docker daemon is runing on your system.</p>
                                    ) : (
                                        <p> No running backend could be found. Looking at: {backendUrl}</p>
                                    )}
                                    <p> 
                                        
                                    </p>
                                    { isPlatform('electron') && backendStatus === 'offline' ? (<p>
                                        The desktop app did not start the local backend server, please contact the developer
                                    </p>) : null }
                                    { isPlatform('desktop') && backendStatus === 'offline' ? (<>
                                    <p>
                                        When using a Browser as frontend, you need to run start the backend server yourself.
                                        You can use <code>npx</code> to start the server directly:
                                    </p>
                                    <IonItem color="light" lines="none">
                                        <pre><code>
                                            npx @hydrocode/tool-runner 
                                        </code></pre>
                                    </IonItem>
                                    </>) : null }
                                </IonCardContent>
                            </IonCard>
                        </div>
                    </IonCol>
                </IonRow>
            </IonGrid>
            </IonContent>
        </IonPage>
    )
}

export default BackendStatusSwitch