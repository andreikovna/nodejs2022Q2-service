import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common/decorators';
import { forwardRef } from '@nestjs/common/utils';
import { BadRequestException, UnprocessableEntityException } from '@nestjs/common/exceptions';

import { AlbumService } from 'src/album/album.service';
import { ArtistService } from 'src/artist/artist.service';
import { TrackService } from 'src/track/track.service';
import { db } from 'src/database/db';
import { ALBUMS_ERRORS, ARTISTS_ERRORS, isValid, TRACKS_ERRORS } from 'src/utils/constantsAndHelpers';

@Injectable()
export class FavoritesService {
  constructor(
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService,
    @Inject(forwardRef(() => ArtistService))
    private readonly artistService: ArtistService,
  ) {}

  findAll() {
    const tracks = db.favs.tracks.map(id => this.trackService.findOne(id));
    const albums = db.favs.albums.map(id => this.albumService.findOne(id));
    const artists = db.favs.artists.map(id => this.artistService.findOne(id));
    return {
      tracks,
      albums,
      artists,
    };
  }

  addTrackToFavorites(id: string) {
    if (isValid(id)) {
      const track = db.tracks.find(track => track.id === id);
      if (!track) {
        throw new UnprocessableEntityException(TRACKS_ERRORS.TRACK_NOT_FOUND);
      }
      if (track && !db.favs.tracks.includes(id)) {
        db.favs.tracks.push(id);
        return track;
      }
    }
    throw new BadRequestException(TRACKS_ERRORS.INVALID_ID);
  }

  addArtistToFavorites(id: string) {
    if (isValid(id)) {
      const artist = db.artists.find(artist => artist.id === id);
      if (!artist) {
        throw new UnprocessableEntityException(ARTISTS_ERRORS.ARTIST_NOT_FOUND);
      }
      if (artist && !db.favs.artists.includes(id)) {
        db.favs.artists.push(id);
        return artist;
      }
    }
    throw new BadRequestException(ARTISTS_ERRORS.INVALID_ID);
  }

  addAlbumToFavorites(id: string) {
    if (isValid(id)) {
      const album = db.albums.find(album => album.id === id);
      if (!album) {
        throw new UnprocessableEntityException(ALBUMS_ERRORS.ALBUM_NOT_FOUND);
      }
      if (album && !db.favs.albums.includes(id)) {
        db.favs.albums.push(id);
        return album;
      }
    }
    throw new BadRequestException(ALBUMS_ERRORS.INVALID_ID);
  }

  removeAlbumFromFavorites(id: string) {
    if (isValid(id)) {
      db.favs.albums = db.favs.albums.filter(item => item !== id);
      return;
    }
    throw new BadRequestException(ALBUMS_ERRORS.INVALID_ID);
  }

  removeArtistFromFavorites(id: string) {
    if (isValid(id)) {
      db.favs.artists = db.favs.artists.filter(item => item !== id);
      return;
    }
    throw new BadRequestException(ARTISTS_ERRORS.INVALID_ID);
  }

  removeTrackFromFavorites(id: string) {
    if (isValid(id)) {
      db.favs.tracks = db.favs.tracks.filter(item => item !== id);
      return;
    }
    throw new BadRequestException(TRACKS_ERRORS.INVALID_ID);
  }
}
