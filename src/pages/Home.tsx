import './Home.css';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonDatetime,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonList,
  IonModal,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { addCircleOutline } from 'ionicons/icons';
import { useRef, useState } from 'react';

import CountdownElement from '../components/countdown-element/CountdownElement';

const list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

const Home: React.FC = () => {
  const [name, setName] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const modalRef = useRef<HTMLIonModalElement>(null);
  const modalInputRef = useRef<HTMLIonInputElement>(null);

  const handleConfirm = () => {
    if (!name || !endDate) {
      return;
    }

    modalRef.current!.dismiss();
  };

  return (
    <IonPage>
      <IonContent fullscreen className="list-container">
        <IonButton
          id="open-create-modal"
          size="large"
          shape="round"
          className="create-button"
        >
          <IonIcon
            size="large"
            slot="icon-only"
            ios={addCircleOutline}
            md={addCircleOutline}
          />
        </IonButton>

        <IonList className="list" lines="none">
          {list.map((idx) => (
            <IonItem key={idx}>
              <CountdownElement />
            </IonItem>
          ))}
        </IonList>

        <IonModal
          ref={modalRef}
          trigger="open-create-modal"
          onIonModalWillPresent={() => {
            setName(null);
            setEndDate(null);
          }}
        >
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonButton onClick={() => modalRef.current?.dismiss()}>
                  Cancel
                </IonButton>
              </IonButtons>

              <IonTitle>Create New</IonTitle>

              {name && endDate && (
                <IonButtons slot="end">
                  <IonButton strong={true} onClick={handleConfirm}>
                    Confirm
                  </IonButton>
                </IonButtons>
              )}
            </IonToolbar>
          </IonHeader>

          <IonContent className="ion-padding">
            <IonItem lines="none" className="create-countdown-container">
              <IonInput
                label="Countdown Name"
                labelPlacement="stacked"
                ref={modalInputRef}
                type="text"
                placeholder="Countdown Name"
                value={name}
                onIonInput={(evt) => setName(String(evt.target.value))}
              />

              <IonDatetime
                mode="md"
                firstDayOfWeek={1}
                min={new Date().toISOString()}
                value={endDate}
                presentation="date"
                onIonChange={(evt) => setEndDate(String(evt.target.value))}
              />
            </IonItem>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Home;
