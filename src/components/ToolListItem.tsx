import { ToolConfig } from "@hydrocode/tool-runner"
import { IonItem, IonLabel } from "@ionic/react"

const ToolListItem: React.FC<{tool: ToolConfig}> = ({ tool }) => {
    return <>
        <IonItem routerLink={`/tools/${tool.name}/run`}>
            <IonLabel>
                <h1>{ tool.title }</h1>
                <p>{ tool.description }</p>
            </IonLabel>
        </IonItem>
    </>
}

export default ToolListItem