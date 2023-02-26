import { IonItem, IonLabel, IonList, IonListHeader } from "@ionic/react"
import { useTools } from "../context/tools"
import ToolListItem from "./ToolListItem"

const ToolList: React.FC = () => {
    // use the Tool context
    const { tools, status, lastError } = useTools()

    return <>
        <IonList>
            <IonListHeader>
                { status === 'loading' ? 'Loading...' : status === 'pending' ? 'Tools' : 'Errored' }
            </IonListHeader>
            { status === 'errored' ?  (
                <IonItem color="danger">
                    <IonLabel className="ion-text-wrap">
                        <h1>An Error occured</h1>
                        <p>{ lastError ? `${lastError}` : 'No Error was captured. That is weird.'  }</p>
                    </IonLabel>
                </IonItem>
            ) : null }
            {status === 'pending' ? tools.map(tool => <ToolListItem key={tool.name} tool={tool} />) : null}
        </IonList>
    </>
}

export default ToolList