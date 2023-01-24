// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { LoginList } = initSchema(schema);

export {
  LoginList
};