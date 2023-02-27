import { useEffect, useState } from "react";
import { IonAccordion, IonAccordionGroup, IonBadge, IonContent, IonIcon, IonItem, IonLabel, IonList, IonNote, IonSegment, IonSegmentButton, IonTextarea, IonTitle } from "@ionic/react";
import { documentOutline } from 'ionicons/icons'

import ReactJson from 'react-json-view';
import { parse } from 'papaparse';
import DataTable from 'react-data-table-component';


import { StepContent } from "@hydrocode/tool-runner";
import { getStep } from '../backend';

interface StepContentFile {
    name: string,
    type: string,
    content: string
}

const FilePreview: React.FC<StepContentFile> = ({name, type, content}) => {
    const isDark = window.matchMedia('(prefer-color-scheme: dark)').matches
    if (type === 'html') {
        return <>
            <div>
                <iframe srcDoc={content} style={{width: '100%', height: 'calc(100vh - 48px)'}} />
            </div>
        </>
    }
    if (type === 'json') {
        return <>
            <IonContent color="light" className="ion-padding" style={{height: 'calc(100vh - 48px)'}} >
                <ReactJson src={JSON.parse(content)} iconStyle="triangle" theme={isDark ? 'hopscotch' : 'bright'} />
            </IonContent>
        </>
    }
    if (type.toLowerCase() === 'csv') {
        const raw = parse(content, {header: true, dynamicTyping: true})
        const header = (raw.meta.fields as string[]).map(f => {
            return {name: f, selector: (r: any) => r[f], sortable: true}
        })
        const data = raw.data.map((d: any, i) => {return {id: i, ...d}})
        console.log(data)
        return <>
            <IonContent style={{height: 'calc(100vh - 48px)'}}>
                <DataTable columns={header} data={data} pagination theme={isDark ? 'dark' : 'light'} />
            </IonContent>
        </>
    }

    return <>
        <IonContent color="light" className="ion-padding" style={{height: 'calc(100vh - 48px)'}}>
            { content }
        </IonContent>
    </>
}

const StepDetail: React.FC<{step: StepContent}> = ({ step }) => {
    // component state
    const [contents, setContents] = useState<StepContentFile[]>([])
    const [viewName, setViewName] = useState<string>('')
    const [viewContent, setViewContent] = useState<StepContentFile | null>()

    // load a file from the backend
    const addFileToContent = (fileName: string) => {
        // only get the file from the backend if it does not exist
        if (contents.filter(c => c.name === fileName).length === 0) {
            // get a list of all files needed
            const files = [...contents.map(c => c.name), fileName]
            
            // the step does not know its own name
            getStep(step.metadata.stepName, files)
            .then(step => step.files ? setContents([...Object.values(step.files) as StepContentFile[]]) : null)
        }
    }

    // listen to changes in the view name
    useEffect(() => {
        const active = contents.filter(c => c.name === viewName)
        if (active.length > 0) {
            setViewContent({...active[0]})
            setViewName(active[0].name)
        } else {
            setViewContent(null)
            setViewName('')
        }
    }, [viewName])

    return <>
        <IonAccordionGroup>
            
            <IonAccordion>
                <IonItem slot="header">
                    <IonTitle>Result metadata</IonTitle>
                </IonItem>
                <IonList slot="content">
                    <IonItem>
                        <IonLabel slot="start">Tool name</IonLabel>
                        <IonLabel>{ step.metadata.name }</IonLabel>
                    </IonItem>
                    <IonItem>
                        <IonLabel slot="start">Runtime</IonLabel>
                        <IonLabel>{ step.metadata.runtime.toFixed(2) } s</IonLabel>
                    </IonItem>
                    <IonItem>
                        <IonLabel slot="start">Inputs</IonLabel>
                        <IonLabel>{ step.inputs.length }</IonLabel>
                    </IonItem>
                    <IonItem>
                        <IonLabel slot="start">Outputs</IonLabel>
                        <IonLabel>{ step.outputs.length }</IonLabel>
                    </IonItem>
                </IonList>
            </IonAccordion>
            
            { step.log && step.log !== '' ? (
                <IonAccordion>
                    <IonItem slot="header">
                        <IonTitle>Console output</IonTitle>
                    </IonItem>
                    <IonTextarea slot="content">
                        { step.log }
                    </IonTextarea>
                </IonAccordion>
            ) : null}
            
            { step.errors && step.errors !== '' ? (
                <IonAccordion>
                    <IonItem slot="header">
                        <IonTitle>Error messages</IonTitle>
                    </IonItem>
                    <IonTextarea slot="content" className="ion-padding">
                        { step.errors }
                    </IonTextarea>
                </IonAccordion>
            ) : null}

            <IonAccordion>
                <IonItem slot="header">
                    <IonTitle>Inputs</IonTitle>
                    <IonBadge>{ step.inputs.length }</IonBadge>
                </IonItem>
                <IonList slot="content">
                    { step.inputs.map(f => (
                        <IonItem key={f} onClick={() => addFileToContent(f)} button disabled={contents.map(c => c.name).includes(f)}>
                            <IonIcon slot="start" icon={documentOutline} />
                            <IonLabel>{ f }</IonLabel>
                        </IonItem>
                    )) }
                </IonList>
            </IonAccordion>

            <IonAccordion>
                <IonItem slot="header">
                    <IonTitle>Outputs</IonTitle>
                    <IonBadge>{step.outputs.length}</IonBadge>
                </IonItem>
                <IonList slot="content">
                    { step.outputs.map(f => (
                        <IonItem key={f} onClick={() => addFileToContent(f)} button disabled={contents.map(c => c.name).includes(f)}>
                            <IonIcon slot="start" icon={documentOutline} />
                            <IonLabel>{ f }</IonLabel>
                        </IonItem>
                    )) }
                </IonList>
            </IonAccordion>

        </IonAccordionGroup>
        
        { contents.length > 0 ? (<>
            <IonSegment value={viewName} onIonChange={e => setViewName(e.target.value as string)} mode="ios">
                { contents.map(c => <IonSegmentButton key={c.name} value={c.name}>{c.name}</IonSegmentButton>) }
            </IonSegment>
            { viewContent ? <FilePreview {...viewContent} /> : <IonNote>File has no content </IonNote> }
        </>) : null }   
    </>
}

export default StepDetail;