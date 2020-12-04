import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";

export enum CardStatus {
  TODO = "TODO",
  DOING = "DOING",
  DONE = "DONE"
}



export declare class User {
  readonly id: string;
  readonly cognitoID: string;
  readonly name: string;
  readonly boards?: (string | null)[];
  readonly cards?: (string | null)[];
  constructor(init: ModelInit<User>);
  static copyOf(source: User, mutator: (draft: MutableModel<User>) => MutableModel<User> | void): User;
}

export declare class Board {
  readonly id: string;
  readonly title: string;
  readonly users?: (string | null)[];
  readonly cards?: (string | null)[];
  constructor(init: ModelInit<Board>);
  static copyOf(source: Board, mutator: (draft: MutableModel<Board>) => MutableModel<Board> | void): Board;
}

export declare class Card {
  readonly id: string;
  readonly boardID: string;
  readonly title: string;
  readonly status: CardStatus | keyof typeof CardStatus;
  readonly description?: string;
  readonly startDate: string;
  readonly endDate: string;
  readonly tag?: string;
  readonly users?: (string | null)[];
  readonly points?: (string | null)[];
  readonly doneStatus?: string;
  constructor(init: ModelInit<Card>);
  static copyOf(source: Card, mutator: (draft: MutableModel<Card>) => MutableModel<Card> | void): Card;
}

export declare class Point {
  readonly id: string;
  readonly cardID: string;
  readonly title: string;
  readonly checked: boolean;
  constructor(init: ModelInit<Point>);
  static copyOf(source: Point, mutator: (draft: MutableModel<Point>) => MutableModel<Point> | void): Point;
}