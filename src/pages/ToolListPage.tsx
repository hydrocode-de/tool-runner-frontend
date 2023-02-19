import { IonContent, IonPage } from "@ionic/react"

import ToolList from "../components/ToolList"

const ToolListPage: React.FC = () => {
    return (
        <IonPage>
            <IonContent fullscreen>
                <ToolList />
            </IonContent>
        </IonPage>
    )
}

export default ToolListPage