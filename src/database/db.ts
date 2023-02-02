import { IUser } from 'src/user/entities/user.entity';

interface Idb {
  users: IUser[];
}

export const db: Idb = {
  users: [],
};
