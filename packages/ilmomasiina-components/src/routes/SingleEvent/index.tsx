import React from 'react';

import { Col, Row, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { linkComponent, useParams } from '../../config/router';
import { usePaths } from '../../contexts/paths';
import { I18nProvider } from '../../i18n';
import {
  SingleEventProps, SingleEventProvider, useSingleEventContext,
} from '../../modules/singleEvent';
import EventDescription from './components/EventDescription';
import QuotaStatus from './components/QuotaStatus';
import SignupCountdown from './components/SignupCountdown';
import SignupList from './components/SignupList';

const SingleEventView = () => {
  const {
    event, signupsByQuota, pending, error,
  } = useSingleEventContext();
  const Link = linkComponent();
  const paths = usePaths();
  const { t } = useTranslation();

  if (error) {
    return (
      <div className="ilmo--loading-container">
        <h1>{t('errors.title')}</h1>
        <p>{t('singleEvent.loadFailed')}</p>
        <Link to={paths.eventsList}>{t('errors.returnToEvents')}</Link>
      </div>
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
      <Link to={paths.eventsList} style={{ margin: 0 }}>
        {`\u2190 ${t('singleEvent.returnToEvents')}`}
      </Link>
      <Row>
        <Col sm={12} md={8}>
          <EventDescription />
        </Col>
        <Col sm={12} md={4}>
          <SignupCountdown />
          <QuotaStatus />
        </Col>
      </Row>
      {event!.signupsPublic && (
        <>
          <h2>{t('singleEvent.signups.title')}</h2>
          {signupsByQuota!.map((quota) => (
            <SignupList
              key={quota.id}
              quota={quota}
            />
          ))}
        </>
      )}
    </>
  );
};

const SingleEvent = () => {
  const { slug } = useParams<SingleEventProps>();
  return (
    <div>
      <SingleEventProvider slug={slug}>
        <I18nProvider>
          <SingleEventView />
        </I18nProvider>
      </SingleEventProvider>
      {slug === 'epoch6'
        ? (
          <>
            <style>
              {`
              body {
                background-color: var(--epoch6-background);
                color: var(--epoch6-white);
              }

              h1 {
                font-family: Almendra, sans-serif;
              }

              h2 {
                color: var(--epoch6-white);
                font-family: Almendra, sans-serif;
              }
              
              p, div {
                font-family: "Josefin Sans", serif;
                font-optical-sizing: auto;
                font-style: normal;
                font-size: 1.2rem;
                color: #ffdcdc;
              }
              
              .table {
                color: var(--epoch-white);
              }

              .table .thead-light th {
                background-color: var(--epoch6-secondary) !important;
                color: var(--epoch6-white);
              }

              .table th, .table td {
                border-top: 1px solid #fefdfe8a;
                border-bottom: 1px solid #fefdfe8a; 
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

              .ilmo--signup-button {
                border-radius: 1rem;
                border-width: 0;
                box-shadow: inset 0rem 0rem 1.5rem var(--background-color);
                background-color: var(--epoch6-secondary);
                border: 2px solid #5a0f0f;
                transition: all 0.3s ease;
              }

              .ilmo--signup-button:hover {
                box-shadow: 0 0 1rem #884848, 0 0 0.2rem #8b3d3d;
                transform: translateY(-0.2rem);
                background-color: var(--epoch6-secondary);
                 border: 2px solid #5a0f0f;
              }

              .ilmo--signup-button:active {
                box-shadow: inset 0 0 1.5rem var(--white);
                background-color: var(--epoch6-background);
                transform: translateY(0.1rem);
              }

              .ilmo--event-heading {
                border-top: 1px solid var(--epoch6-secondary);
                border-bottom: 1px solid var(--epoch6-secondary);
              }

              .ilmo--side-widget {
                background-color: var(--epoch6-background);
                border-radius: 0.5rem;      
              }
                
              .ilmo--signup-progress {
                background-color: var(--epoch6-background);
                border: 1px solid var(--epoch6-secondary);
              }

              .progress-bar {
                background-color: var(--epoch6-secondary);
              }
              `}
            </style>
          </>
        ) : (
          <style />
        )}
    </div>
  );
};

export default SingleEvent;
