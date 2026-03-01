import './Home.css';
import { DatePicker } from '@capacitor-community/date-picker';
import { IonContent, IonItem, IonList, IonPage } from '@ionic/react';

import CountdownElement from '../components/CountdownElement';

const list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonContent fullscreen className="list-container">
        <IonList className="list" lines="none">
          {list.map((idx) => (
            <IonItem
              key={idx}
              onClick={async () =>
                await DatePicker.present({ mode: 'date', theme: 'dark' })
              }
            >
              <CountdownElement />
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Home;
