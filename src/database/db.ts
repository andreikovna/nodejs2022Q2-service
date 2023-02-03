import { IAlbum } from 'src/album/entities/album.entity';
import { IArtist } from 'src/artist/entities/artist.entity';
import { IFavorites } from 'src/favs/entities/favorites.entity';
import { ITrack } from 'src/track/entities/track.entity';
import { IUser } from 'src/user/entities/user.entity';

interface Idb {
  users: IUser[];
  artists: IArtist[];
  albums: IAlbum[];
  tracks: ITrack[];
  favs: IFavorites;
}

export const db: Idb = {
  users: [],
  artists: [],
  albums: [],
  tracks: [],
  favs: {
    albums: [],
    artists: [],
    tracks: [],
  },
};
