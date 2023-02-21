import { IonBadge, IonIcon, IonItem, IonLabel, IonList, IonListHeader } from "@ionic/react"
import { StepPreview } from "@hydrocode/tool-runner"
import { folder } from 'ionicons/icons'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

const StepsList: React.FC<{steps: StepPreview[]}> = ({ steps }) => {
    return (
        <IonList>
            <IonListHeader>Steps</IonListHeader>

            { steps.map(step => (
                <IonItem>
                    <IonIcon icon={folder} slot="start" />
                    {  step.created ? (
                        <IonLabel slot="end">
                            <IonBadge color="primary">{dayjs(step.created).fromNow()}</IonBadge>
                        </IonLabel>
                    ) : null }
                    <IonLabel>
                        { step.name }
                    </IonLabel>
                </IonItem>
            )) }

        </IonList>
    )
}

export default StepsList