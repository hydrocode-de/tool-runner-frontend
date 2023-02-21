import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle } from "@ionic/react"

const ErrorMessage: React.FC<{message: string, backLink?: string}> = ({ message, backLink }) => {
    return (
        <IonCard color="danger">
            <IonCardHeader>
                <IonCardTitle>Backend error occured</IonCardTitle>
                <IonCardContent>
                    { message }
                </IonCardContent>
                <IonButton color="light" fill="clear" routerLink={backLink ? backLink : '/'} routerDirection="back">BACK</IonButton>
            </IonCardHeader>
        </IonCard>
    )
}

export default ErrorMessage