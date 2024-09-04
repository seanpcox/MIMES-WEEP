// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const Device = {
  "MOBILE": "mobile",
  "TABLET": "tablet",
  "DESKTOP": "desktop"
};

const Period = {
  "DAY": "day",
  "MONTH": "month",
  "ALL": "all"
};

const { Todo } = initSchema(schema);

export {
  Todo,
  Device,
  Period
};