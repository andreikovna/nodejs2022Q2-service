import { IArtist } from 'src/artist/entities/artist.entity';
import { IUser } from 'src/user/entities/user.entity';

interface Idb {
  users: IUser[];
  artists: IArtist[];
}

export const db: Idb = {
  users: [],
  artists: [],
};
