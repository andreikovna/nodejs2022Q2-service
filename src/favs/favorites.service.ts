import { Injectable } from '@nestjs/common';
import { UnprocessableEntityException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ALBUMS_ERRORS, ARTISTS_ERRORS, TRACKS_ERRORS } from 'src/utils/constantsAndHelpers';
import { Favs } from './entities/favorites.entity';
import { Artist } from 'src/artist/entities/artist.entity';
import { Track } from 'src/track/entities/track.entity';
import { Album } from 'src/album/entities/album.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Track)
    private readonly trackRepository: Repository<Track>,
    @InjectRepository(Album)
    private readonly albumRepository: Repository<Album>,
    @InjectRepository(Artist)
    private readonly artistRepository: Repository<Artist>,
    @InjectRepository(Favs)
    private readonly favsRepository: Repository<Favs>,
  ) {}

  async findAll() {
    const [allFavs] = await this.favsRepository.find({
      relations: {
        artists: true,
        albums: true,
        tracks: true,
      },
    });

    if (allFavs) {
      return allFavs;
    }

    await this.favsRepository.save(new Favs());

    const [emptyFavs] = await this.favsRepository.find({
      relations: {
        artists: true,
        albums: true,
        tracks: true,
      },
    });

    return emptyFavs;
  }

  async addTrackToFavorites(id: string) {
    const track = await this.trackRepository.findOneBy({ id });
    if (!track) {
      throw new UnprocessableEntityException(TRACKS_ERRORS.TRACK_NOT_FOUND);
    }
    const [fav] = await this.favsRepository.find({
      relations: {
        tracks: true,
      },
    });

    if (!fav) {
      await this.favsRepository.save(new Favs());
    }

    fav.tracks.push(track);

    await this.favsRepository.save(fav);
    return track;
  }

  async addArtistToFavorites(id: string) {
    const artist = await this.artistRepository.findOneBy({ id });
    if (!artist) {
      throw new UnprocessableEntityException(ARTISTS_ERRORS.ARTIST_NOT_FOUND);
    }
    const [fav] = await this.favsRepository.find({
      relations: {
        artists: true,
      },
    });

    if (!fav) {
      await this.favsRepository.save(new Favs());
    }

    fav.artists.push(artist);

    await this.favsRepository.save(fav);
    return artist;
  }

  async addAlbumToFavorites(id: string) {
    const album = await this.albumRepository.findOneBy({ id });
    if (!album) {
      throw new UnprocessableEntityException(ALBUMS_ERRORS.ALBUM_NOT_FOUND);
    }
    const [fav] = await this.favsRepository.find({
      relations: {
        albums: true,
      },
    });

    if (!fav) {
      await this.favsRepository.save(new Favs());
    }

    fav.albums.push(album);

    await this.favsRepository.save(fav);
    return album;
  }

  async removeAlbumFromFavorites(id: string) {
    const album = await this.albumRepository.findOneBy({ id });
    if (!album) {
      throw new UnprocessableEntityException(ALBUMS_ERRORS.ALBUM_NOT_FOUND);
    }

    const [favs] = await this.favsRepository.find({
      relations: {
        albums: true,
      },
    });

    favs.albums = favs.albums.filter(item => item.id !== id);

    await this.favsRepository.save(favs);
    return;
  }

  async removeArtistFromFavorites(id: string) {
    const artist = await this.artistRepository.findOneBy({ id });

    const [favs] = await this.favsRepository.find({
      relations: {
        artists: true,
      },
    });

    favs.artists = favs.artists.filter(item => item.id !== id);

    await this.favsRepository.save(favs);
    return;
  }

  async removeTrackFromFavorites(id: string) {
    const track = await this.trackRepository.findOneBy({ id });

    const [favs] = await this.favsRepository.find({
      relations: {
        tracks: true,
      },
    });

    favs.tracks = favs.tracks.filter(item => item.id !== id);

    await this.favsRepository.save(favs);
    return;
  }
}
