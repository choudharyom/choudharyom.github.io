import React from 'react';
import type { GatsbyBrowser } from 'gatsby';
import Auth0Provider from './src/components/Auth0Provider';

import './src/styles/global.css';

export const wrapRootElement: GatsbyBrowser['wrapRootElement'] = ({ element }) => {
  return <Auth0Provider>{element}</Auth0Provider>;
};
