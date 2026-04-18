import './theme/variables.css';
import { IonApp, setupIonicReact } from '@ionic/react';
import '@ionic/react/css/core.css';
import '@ionic/react/css/display.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/palettes/dark.system.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/typography.css';
import { useEffect, useState } from 'react';

import { CountdownType } from './types/common';

import {
  getCountdowns,
  removeCountdown,
  saveCountdown,
} from './utils/dataUtils';

import Home from './pages/Home';

setupIonicReact();

const App = () => {
  const [countdowns, setCountdowns] = useState<CountdownType[]>([]);

  useEffect(() => {
    refreshCountdowns();
  }, []);

  const refreshCountdowns = async () => {
    setCountdowns(await getCountdowns());
  };

  const onCountdownCreated = async (name: string, endDate: Date) => {
    await saveCountdown(name, new Date(endDate));

    refreshCountdowns();
  };

  const handleDeleteCountdown = async (ref: string) => {
    await removeCountdown(ref);
  };

  return (
    <IonApp>
      <Home
        countdowns={countdowns}
        onCountdownCreated={onCountdownCreated}
        handleDeleteCountdown={handleDeleteCountdown}
      />
    </IonApp>
  );
};

export default App;
