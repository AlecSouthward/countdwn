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
  IonToolbar,
} from '@ionic/react';
import { addCircleOutline } from 'ionicons/icons';
import { useMemo, useRef, useState } from 'react';

import { CountdownType } from '../types/common';

import CountdownElement from '../components/countdown-element/CountdownElement';
import DeleteModal from '../components/modal/delete-modal/DeleteModal';

type Props = {
  countdowns: CountdownType[];
  handleCreateCountdown: (name: string, endDate: Date) => void;
  handleEditCountdown: (ref: string, name: string, endDate: Date) => void;
  handleDeleteCountdown: (ref: string) => void;
};

const Home = ({
  countdowns,
  handleCreateCountdown,
  handleEditCountdown,
  handleDeleteCountdown,
}: Props) => {
  const [name, setName] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [selectedCountdownRef, setSelectedCountdownRef] = useState<
    string | null
  >(null);
  const [countdownRefToDelete, setCountdownRefToDelete] = useState<
    string | undefined
  >(undefined);
  const [countdownToEdit, setCountdownToEdit] = useState<
    CountdownType | undefined
  >();

  const sortedCountdowns = useMemo(
    () =>
      countdowns.toSorted((a, b) => b.endDate.getTime() - a.endDate.getTime()),
    [countdowns]
  );

  const modalRef = useRef<HTMLIonModalElement>(null);
  const modalInputRef = useRef<HTMLIonInputElement>(null);

  const handleConfirm = async () => {
    if (!name || !endDate) {
      return;
    }

    modalRef.current!.dismiss();

    if (countdownToEdit) {
      handleEditCountdown(countdownToEdit.ref, name, new Date(endDate));
    } else {
      handleCreateCountdown(name, new Date(endDate));
    }

    setCountdownToEdit(undefined);
  };

  const handleCountdownClick = (ref: string) => {
    if (ref === selectedCountdownRef) {
      setSelectedCountdownRef(null);

      return;
    }

    setSelectedCountdownRef(ref);
  };

  return (
    <>
      <IonPage>
        <IonContent fullscreen className="list-container">
          <IonButton
            id="open-countdown-modal"
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
            {sortedCountdowns.map((countdown) => (
              <IonItem key={countdown.ref}>
                <CountdownElement
                  countdown={countdown}
                  selectedRef={selectedCountdownRef}
                  handleClick={() => handleCountdownClick(countdown.ref)}
                  handleDeleteClick={setCountdownRefToDelete}
                  handleEditClick={(countdown) => {
                    setCountdownToEdit(countdown);
                    setName(countdown.name);
                    setEndDate(countdown.endDate.toISOString());

                    modalRef.current!.present();
                  }}
                />
              </IonItem>
            ))}

            {countdowns.length === 0 && (
              <IonItem>
                <h1>No countdowns saved.</h1>
              </IonItem>
            )}
          </IonList>

          <IonModal
            ref={modalRef}
            trigger="open-countdown-modal"
            onIonModalWillPresent={() => {
              if (countdownToEdit) return;

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

                {name && endDate && (
                  <IonButtons slot="end">
                    <IonButton strong={true} onClick={handleConfirm}>
                      {countdownToEdit ? 'Update' : 'Create'}
                    </IonButton>
                  </IonButtons>
                )}
              </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding">
              <IonItem
                lines="none"
                className="create-countdown-container"
                style={{ flexDirection: 'column' }}
              >
                <IonInput
                  label="Name"
                  fill="outline"
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
                  size="cover"
                  onIonChange={(evt) => setEndDate(String(evt.target.value))}
                />
              </IonItem>
            </IonContent>
          </IonModal>
        </IonContent>
      </IonPage>

      {countdownRefToDelete && (
        <DeleteModal
          handleDeleteConfirmClick={() => {
            handleDeleteCountdown(countdownRefToDelete);
            setCountdownRefToDelete(undefined);
          }}
          handleDeleteCancelClick={() => setCountdownRefToDelete(undefined)}
        />
      )}
    </>
  );
};

export default Home;
