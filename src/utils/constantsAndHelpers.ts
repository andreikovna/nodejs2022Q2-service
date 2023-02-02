import { validate, version } from 'uuid';

export const isValid = (id: string): boolean => {
  return validate(id) && version(id) === 4;
};

export enum USER_ERRORS {
  INVALID_ID = 'Invalid user ID',
  USER_NOT_FOUND = 'User Not Found',
  REQUIRED_FIELDS = `Body doesn't contain required fields`,
  INVALID_BODY_FORMAT = `Login and Password should be string`,
  WRONG_PASSWORD = 'Wrong password',
}
