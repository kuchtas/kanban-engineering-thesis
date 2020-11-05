/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
      id
      cognitoID
      name
      boards
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
      id
      cognitoID
      name
      boards
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
      id
      cognitoID
      name
      boards
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const createBoard = /* GraphQL */ `
  mutation CreateBoard(
    $input: CreateBoardInput!
    $condition: ModelBoardConditionInput
  ) {
    createBoard(input: $input, condition: $condition) {
      id
      title
      users
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const updateBoard = /* GraphQL */ `
  mutation UpdateBoard(
    $input: UpdateBoardInput!
    $condition: ModelBoardConditionInput
  ) {
    updateBoard(input: $input, condition: $condition) {
      id
      title
      users
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const deleteBoard = /* GraphQL */ `
  mutation DeleteBoard(
    $input: DeleteBoardInput!
    $condition: ModelBoardConditionInput
  ) {
    deleteBoard(input: $input, condition: $condition) {
      id
      title
      users
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const createCard = /* GraphQL */ `
  mutation CreateCard(
    $input: CreateCardInput!
    $condition: ModelCardConditionInput
  ) {
    createCard(input: $input, condition: $condition) {
      id
      boardID
      title
      status
      description
      startDate
      endDate
      tag
      users
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const updateCard = /* GraphQL */ `
  mutation UpdateCard(
    $input: UpdateCardInput!
    $condition: ModelCardConditionInput
  ) {
    updateCard(input: $input, condition: $condition) {
      id
      boardID
      title
      status
      description
      startDate
      endDate
      tag
      users
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const deleteCard = /* GraphQL */ `
  mutation DeleteCard(
    $input: DeleteCardInput!
    $condition: ModelCardConditionInput
  ) {
    deleteCard(input: $input, condition: $condition) {
      id
      boardID
      title
      status
      description
      startDate
      endDate
      tag
      users
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const createPoint = /* GraphQL */ `
  mutation CreatePoint(
    $input: CreatePointInput!
    $condition: ModelPointConditionInput
  ) {
    createPoint(input: $input, condition: $condition) {
      id
      cardID
      title
      description
      checked
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const updatePoint = /* GraphQL */ `
  mutation UpdatePoint(
    $input: UpdatePointInput!
    $condition: ModelPointConditionInput
  ) {
    updatePoint(input: $input, condition: $condition) {
      id
      cardID
      title
      description
      checked
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const deletePoint = /* GraphQL */ `
  mutation DeletePoint(
    $input: DeletePointInput!
    $condition: ModelPointConditionInput
  ) {
    deletePoint(input: $input, condition: $condition) {
      id
      cardID
      title
      description
      checked
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
