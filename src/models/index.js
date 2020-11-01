// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { User, Board } = initSchema(schema);

export {
  User,
  Board
};