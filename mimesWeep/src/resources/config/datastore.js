// eslint-disable-next-line no-undef
const API_KEY = process.env.REACT_APP_API_KEY;
const ENDPOINT = process.env.REACT_APP_ENDPOINT;
const REGION = process.env.REACT_APP_REGION;
const AUTH_MODE = process.env.REACT_APP_AUTH_MODE;

export const settings = {
    API: {
        GraphQL: {
            endpoint: ENDPOINT,
            defaultAuthMode: AUTH_MODE,
            apiKey: API_KEY,
            region: REGION,
        }
    }
};
