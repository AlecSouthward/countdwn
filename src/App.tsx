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
  updateCountdown,
} from './utils/dataUtils';

import Home from './pages/Home';

setupIonicReact();

const App = () => {
  const [countdowns, setCountdowns] = useState<CountdownType[]>([]);

  useEffect(() => {
    refreshCountdowns();
  }, []);

  const refreshCountdowns = async () => {
    const countdowns = await getCountdowns();
    setCountdowns(Object.values(countdowns));
  };

  const handleCreateCountdown = async (name: string, endDate: Date) => {
    await saveCountdown(name, new Date(endDate));

    refreshCountdowns();
  };

  const handleEditCountdown = async (
    ref: string,
    name: string,
    endDate: Date
  ) => {
    console.log(ref, name, endDate);
    await updateCountdown(ref, name, endDate);

    refreshCountdowns();
  };

  const handleDeleteCountdown = async (ref: string) => {
    await removeCountdown(ref);

    refreshCountdowns();
  };

  return (
    <IonApp>
      <Home
        countdowns={countdowns}
        handleCreateCountdown={handleCreateCountdown}
        handleEditCountdown={handleEditCountdown}
        handleDeleteCountdown={handleDeleteCountdown}
      />
    </IonApp>
  );
};

export default App;
