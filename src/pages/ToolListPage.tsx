import { IonContent, IonPage } from "@ionic/react"

import ToolList from "../components/ToolList"

const ToolListPage: React.FC = () => {
    return (
        <IonPage>
            <IonContent fullscreen>
                {/* <h1>Online</h1> */}
                <ToolList />
            </IonContent>
        </IonPage>
    )
}

export default ToolListPage