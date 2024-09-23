const API_KEY = process.env.REACT_APP_API_KEY;

export const settings = {
    API: {
        GraphQL: {
            endpoint: 'https://fha5mz4fmvgf7gx5wu6tcs4x7y.appsync-api.us-east-1.amazonaws.com/graphql',
            defaultAuthMode: 'apiKey',
            apiKey: API_KEY,
            region: 'us-east-1',
        }
    }
};