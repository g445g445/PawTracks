// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const PetType = {
  "DOG": "DOG",
  "CAT": "CAT",
  "BIRD": "BIRD"
};

const { UserSettings, Session, Pet, LoginList } = initSchema(schema);

export {
  UserSettings,
  Session,
  Pet,
  LoginList,
  PetType
};