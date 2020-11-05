// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const CardStatus = {
  "TODO": "TODO",
  "DOING": "DOING",
  "DONE": "DONE"
};

const { User, Board, Card, Point } = initSchema(schema);

export {
  User,
  Board,
  Card,
  Point,
  CardStatus
};