import { IonIcon, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel } from "@ionic/react"
import { eye, list, playCircleOutline } from 'ionicons/icons'

import { ToolConfig } from "@hydrocode/tool-runner"


const ToolListItem: React.FC<{tool: ToolConfig}> = ({ tool }) => {
    return <>
        <IonItemSliding>
            <IonItemOptions slot="start">
                <IonItemOption color="success">RUN</IonItemOption>
            </IonItemOptions>

            <IonItem routerLink={`/tools/${tool.name}/run`}>
                <IonLabel>
                    <h1>{ tool.title }</h1>
                    <p>{ tool.description }</p>
                </IonLabel>
            </IonItem>

            <IonItemOptions slot="end">
                <IonItemOption color="light" disabled>
                    <IonIcon slot="icon-only" icon={eye} />
                </IonItemOption>
                <IonItemOption color="light" routerLink={`/tools/${tool.name}/steps`}>
                    <IonIcon slot="icon-only" icon={list} />
                </IonItemOption>
                <IonItemOption color="success" routerLink={`/tools/${tool.name}/run`}>
                    <IonIcon slot="icon-only" icon={playCircleOutline} />
                </IonItemOption>
            </IonItemOptions>
        </IonItemSliding>
    </>
}

export default ToolListItem