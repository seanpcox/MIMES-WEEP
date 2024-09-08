import { secret } from '@aws-amplify/backend';

export const settings = {
    API: {
        GraphQL: {
            endpoint: secret("endpoint"),
            defaultAuthMode: secret("defaultAuthMode"),
            apiKey: secret("apiKey"),
            region: secret("region")
        }
    }
};