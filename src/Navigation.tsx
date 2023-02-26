import { IonRouterOutlet } from "@ionic/react"
import { Redirect, Route } from "react-router"


// load the different pages
import ToolPage from './pages/ToolPage';
import ToolListPage from './pages/ToolListPage';
import StepsListPage from './pages/StepsListPage';
import StepPage from './pages/StepPage';

const Navigation: React.FC = () => {

    return (
            <IonRouterOutlet>

            <Route exact path="/tools">
                <ToolListPage />
            </Route>

            <Route exact path="/tools/:toolName/steps" component={StepsListPage} />

            <Route exact path="/tools/:toolName/:action" component={ToolPage} />
            
            <Route exact path="/steps" component={StepsListPage} />

            <Route exact path="/steps/:stepName" component={StepPage} />

            <Route exact path="/">
                <Redirect to="/tools" />
            </Route>
            
            </IonRouterOutlet>
    )
}

export default Navigation