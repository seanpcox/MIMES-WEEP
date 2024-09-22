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
  "WEEK": "week",
  "MONTH": "month",
  "YEAR": "year",
  "ALL": "all"
};

const { Todo } = initSchema(schema);

export {
  Todo,
  Device,
  Period
};