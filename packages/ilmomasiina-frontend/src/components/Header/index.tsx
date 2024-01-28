import React from 'react';

import { Button, Container, Image, Navbar } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import branding from '../../branding';
import i18n from '../../i18n';
import { logout } from '../../modules/auth/actions';
import appPaths from '../../paths';
import { useTypedDispatch, useTypedSelector } from '../../store/reducers';

import './Header.scss';

const Header = () => {
  const dispatch = useTypedDispatch();
  const loggedIn = useTypedSelector((state) => state.auth.loggedIn);
  const { i18n: { language }, t } = useTranslation();

  return (
    <Navbar>
      <Container>
        <Image
          style={{ height: '3rem', display: 'none' }}
          src="https://i.ibb.co/PZf4chr/data-Guild-Stamp.png"
          className="dg-logo"
        />
        <Link to={appPaths.eventsList} className="navbar-brand mr-auto">
          {branding.headerTitle}
        </Link>
        {/*{language !== 'fi' && (*/}
        {/*  <Button onClick={() => i18n.changeLanguage('fi')}>{t('header.switchLanguage', { lng: 'fi' })}</Button>*/}
        {/*)}*/}
        {language !== 'en' && (
          <Button onClick={() => i18n.changeLanguage('en')}>{t('header.switchLanguage', { lng: 'en' })}</Button>
        )}
        {loggedIn && (
          <Button onClick={() => dispatch(logout())}>{t('header.logout')}</Button>
        )}
      </Container>
    </Navbar>
  );
};

export default Header;
