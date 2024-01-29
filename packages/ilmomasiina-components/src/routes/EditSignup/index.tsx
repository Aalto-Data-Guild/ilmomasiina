import React from 'react';

import { Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { useParams } from '../../config/router';
import { I18nProvider } from '../../i18n';
import { EditSignupProps, EditSignupProvider, useEditSignupContext } from '../../modules/editSignup';
import EditForm from './components/EditForm';
import NarrowContainer from './components/NarrowContainer';

const EditSignupView = () => {
  const { error, pending, event } = useEditSignupContext();
  const { t } = useTranslation();

  if (error) {
    return (
      <NarrowContainer className="ilmo--status-container">
        <h1>{t('errors.title')}</h1>
        <p>{t('editSignup.errors.loadFailed')}</p>
      </NarrowContainer>
    );
  }

  if (pending) {
    return (
      <div className="ilmo--loading-container">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <>
      {event?.slug === 'epoch5'
        ? (
          <>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=MedievalSharp" />
            <style>
              {`
                body {
                  background-image: url("https://i.ibb.co/58bwmJQ/papertexture2.png");
                  background-repeat: repeat;
                  background-color: #FFEDCF;
                  font-family: MedievalReadable;
                  font-size: 1.2rem;
                  font-weight: 500;
                }

                h1 {
                  font-family: MedievalFancy;
                }

                .dg-logo {
                  display: block !important;
                }

                footer {
                  background-color: #e8d6ac;
                  border-top: black dotted 1px;
                }

                .ilmo--side-widget {
                  background-color: #e8d6ac;
                  border-radius: 0.5rem;
                `}
            </style>
          </>
        ) : (<style />)}
      <EditForm />
    </>
  );
};

const EditSignup = () => {
  const { id, editToken } = useParams<EditSignupProps>();
  return (
    <EditSignupProvider id={id} editToken={editToken}>
      <I18nProvider>
        <EditSignupView />
      </I18nProvider>
    </EditSignupProvider>
  );
};

export default EditSignup;
