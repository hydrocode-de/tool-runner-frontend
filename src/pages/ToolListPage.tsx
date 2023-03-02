import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, isPlatform } from "@ionic/react"

import ToolList from "../components/ToolList"

const ToolListPage: React.FC = () => {
    return (
        <IonPage>
            { isPlatform('electron') ? null : (
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonBackButton />
                        </IonButtons>
                        <IonTitle>Tool list</IonTitle>
                        
                    </IonToolbar>
                </IonHeader>
            )}
            <IonContent fullscreen>
                <ToolList />
            </IonContent>
        </IonPage>
    )
}

export default ToolListPage