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
      {event?.slug === 'epoch6'
        ? (
          <>
            <style>
              {`
                body {
                background-color: var(--epoch6-background);
                color: var(--epoch6-white);
              }

              h1 {
                font-family: Almendra;
              }
              
              p, div {
                font-family: "Josefin Sans", serif;
                font-optical-sizing: auto;
                font-style: normal;
                color: #ffdcdc;
                font-size: 1.2rem;
              }

              footer {
                background-color: var(--epoch6-background);
                border-top: var(--epoch6-secondary) dotted 1px;
              }

              .navbar {
                background-color: var(--epoch6-background);
                box-shadow: inset 0rem -2rem 5rem #8a070a85;
              }

              a {
                color: #ee383c;
              }

              .bnt-primary {
                border-radius: 1rem;
                border-width: 0;
                box-shadow: inset 0rem 0rem 1.5rem var(--background-color);
                background-color: var(--epoch6-secondary);
                border: 2px solid #5a0f0f;
                transition: all 0.3s ease;
              }

              .btn-primary:hover {
                box-shadow: 0 0 1rem #884848, 0 0 0.2rem #8b3d3d;
                transform: translateY(-0.2rem);
                background-color: var(--epoch6-secondary);
                 border: 2px solid #5a0f0f;
              }

              .btn-primary:active {
                box-shadow: inset 0 0 1.5rem var(--white);
                background-color: var(--epoch6-background);
                transform: translateY(0.1rem);
              }
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
