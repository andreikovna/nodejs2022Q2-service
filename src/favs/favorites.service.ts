import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common/decorators';
import { forwardRef } from '@nestjs/common/utils';
import { UnprocessableEntityException } from '@nestjs/common/exceptions';

import { AlbumService } from 'src/album/album.service';
import { ArtistService } from 'src/artist/artist.service';
import { TrackService } from 'src/track/track.service';
import { ALBUMS_ERRORS, ARTISTS_ERRORS, isValid, TRACKS_ERRORS } from 'src/utils/constantsAndHelpers';
import { InjectRepository } from '@nestjs/typeorm';
import { Favs } from './entities/favorites.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FavoritesService {
  constructor(
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService,
    @Inject(forwardRef(() => ArtistService))
    private readonly artistService: ArtistService,
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
    const track = await this.trackService.findOne(id);
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
    const artist = await this.artistService.findOne(id);
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
    const album = await this.albumService.findOne(id);
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
    const album = await this.albumService.findOne(id);
    if (!album) {
      throw new UnprocessableEntityException(ALBUMS_ERRORS.ARTIST_NOT_FOUND);
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
    const artist = await this.artistService.findOne(id);

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
    const track = await this.trackService.findOne(id);

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
