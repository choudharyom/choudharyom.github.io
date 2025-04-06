interface Auth0Config {
  domain: string;
  clientId: string;
}

const auth0Config: Auth0Config = {
  domain: process.env.GATSBY_AUTH0_DOMAIN || '',
  clientId: process.env.GATSBY_AUTH0_CLIENT_ID || '',
};

export default auth0Config;
