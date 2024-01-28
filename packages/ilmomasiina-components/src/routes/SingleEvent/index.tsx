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
      {slug === 'epoch'
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

              .table .thead-light th {
                background-color: #e8d6ac !important;
              }

              footer {
                background-color: #e8d6ac;
                border-top: black dotted 1px;
              }

              .ilmo--signup-button {
                background-color: #9e0e0e;
                border: 0;
              }

              .ilmo--event-heading {
                border-top: 1px solid #8B4513;
                border-bottom: 1px solid #8B4513;
              }

              .ilmo--side-widget {
                background-color: #e8d6ac;
                border-radius: 0.5rem;
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
