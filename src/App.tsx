import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

// load the different pages
import Home from './pages/Home';
import ToolPage from './pages/ToolPage';
import ToolListPage from './pages/ToolListPage';
import StepsListPage from './pages/StepsListPage';
import StepPage from './pages/StepPage';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        
        <Route exact path="/home">
          <Home />
        </Route>

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
    </IonReactRouter>
  </IonApp>
);

export default App;
