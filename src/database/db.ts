import { IAlbum } from 'src//album/entities/album.entity';
import { IArtist } from 'src/artist/entities/artist.entity';
import { IUser } from 'src/user/entities/user.entity';

interface Idb {
  users: IUser[];
  artists: IArtist[];
  albums: IAlbum[];
}

export const db: Idb = {
  users: [],
  artists: [],
  albums: [],
};
