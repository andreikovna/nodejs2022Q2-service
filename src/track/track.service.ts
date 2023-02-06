import { v4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { BadRequestException, NotFoundException } from '@nestjs/common/exceptions';

import { Inject } from '@nestjs/common/decorators';
import { forwardRef } from '@nestjs/common/utils';

import { AlbumService } from 'src/album/album.service';
import { ArtistService } from 'src/artist/artist.service';
import { db } from 'src/database/db';
import { isValid, TRACKS_ERRORS } from 'src/utils/constantsAndHelpers';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';

@Injectable()
export class TrackService {
  constructor(
    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService,
    @Inject(forwardRef(() => ArtistService))
    private readonly artistService: ArtistService,
  ) {}

  create({ name, duration, artistId, albumId }: CreateTrackDto) {
    if ((!artistId && artistId !== null) || (!albumId && albumId !== null)) {
      throw new BadRequestException(TRACKS_ERRORS.REQUIRED_FIELDS);
    }

    if ((typeof artistId !== 'string' && artistId !== null) || (typeof albumId !== 'string' && albumId !== null)) {
      throw new BadRequestException(TRACKS_ERRORS.INVALID_BODY_FORMAT);
    }
    const newTrack = {
      id: v4(),
      name,
      duration,
      artistId: null,
      albumId: null,
    };

    if (artistId) {
      const isArtist = this.artistService.findOne(artistId);
      if (isArtist) {
        newTrack.artistId = artistId;
      }
    }
    if (albumId) {
      const isAlbum = this.albumService.findOne(albumId);
      if (isAlbum) {
        newTrack.albumId = albumId;
      }
    }
    db.tracks.push(newTrack);

    return newTrack;
  }

  findAll() {
    return db.tracks;
  }

  findOne(id: string) {
    if (isValid(id)) {
      const track = db.tracks.find(track => track.id === id);
      if (track) {
        return track;
      } else throw new NotFoundException(TRACKS_ERRORS.TRACK_NOT_FOUND);
    }
    throw new BadRequestException(TRACKS_ERRORS.INVALID_ID);
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    const { artistId, albumId } = updateTrackDto;
    if (
      (typeof artistId !== 'string' && artistId !== null) ||
      artistId === '' ||
      (typeof albumId !== 'string' && albumId !== null) ||
      albumId === ''
    ) {
      throw new BadRequestException(TRACKS_ERRORS.INVALID_BODY_FORMAT);
    }
    if (artistId) {
      this.artistService.findOne(artistId);
    }

    if (albumId) {
      this.albumService.findOne(albumId);
    }

    if (isValid(id)) {
      const index = db.tracks.findIndex(track => track.id === id);
      if (index !== -1) {
        const updateTrack = db.tracks[index];
        db.tracks[index] = { ...updateTrack, ...updateTrackDto };
        return db.tracks[index];
      } else throw new NotFoundException(TRACKS_ERRORS.TRACK_NOT_FOUND);
    }
    throw new BadRequestException(TRACKS_ERRORS.INVALID_ID);
  }

  remove(id: string) {
    if (isValid(id)) {
      const track = db.tracks.find(track => track.id === id);
      if (track) {
        db.tracks = db.tracks.filter(track => track.id !== id);
        db.favs.tracks = db.favs.tracks.filter(track => track !== id);
        return;
      } else throw new NotFoundException(TRACKS_ERRORS.TRACK_NOT_FOUND);
    }
    throw new BadRequestException(TRACKS_ERRORS.INVALID_ID);
  }
}
