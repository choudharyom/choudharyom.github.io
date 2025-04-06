import React from 'react';
import { Auth0Provider as BaseAuth0Provider } from '@auth0/auth0-react';
import { navigate } from 'gatsby';
import auth0Config from '../utils/auth0-config';

interface Auth0ProviderProps {
  children: React.ReactNode;
}

const Auth0Provider: React.FC<Auth0ProviderProps> = ({ children }) => {
  const onRedirectCallback = (appState: any) => {
    // Use Gatsby's navigate method to replace the url
    navigate(appState?.returnTo || '/', { replace: true });
  };

  return (
    <BaseAuth0Provider
      domain={auth0Config.domain}
      clientId={auth0Config.clientId}
      authorizationParams={{
        redirect_uri: typeof window !== 'undefined' ? window.location.origin : '',
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </BaseAuth0Provider>
  );
};

export default Auth0Provider;
