import { validate, version } from 'uuid';

export const isValid = (id: string): boolean => {
  return validate(id) && version(id) === 4;
};

export enum USER_ERRORS {
  INVALID_ID = 'Invalid user ID',
  USER_NOT_FOUND = 'User Not Found',
  REQUIRED_FIELDS = `Body doesn't contain required fields`,
  INVALID_BODY_FORMAT = `Login and Password should be string`,
  INVALID_PASSWORD_FORMAT = `NewPassword and OldPassword should be string`,
  WRONG_PASSWORD = 'Wrong password',
}

export enum ARTISTS_ERRORS {
  INVALID_ID = 'Invalid artist ID',
  ARTIST_NOT_FOUND = 'Artist Not Found',
  REQUIRED_FIELDS = `Body doesn't contain required fields`,
  INVALID_BODY_FORMAT = `Name should be string and Grammy should be boolean`,
}

export enum ALBUMS_ERRORS {
  INVALID_ID = 'Invalid album ID',
  ALBUM_NOT_FOUND = 'Album Not Found',
  REQUIRED_FIELDS = `Body doesn't contain required fields`,
  INVALID_BODY_FORMAT = `Name should be string, Year should be number, ArtistId could be NOT empty string or null`,
}
