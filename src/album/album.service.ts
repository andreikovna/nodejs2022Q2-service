import { ArtistService } from './../artist/artist.service';
import { isValid } from 'src/utils/constantsAndHelpers';
import { v4 } from 'uuid';
import { ALBUMS_ERRORS } from './../utils/constantsAndHelpers';
import { db } from 'src/database/db';
import { Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common/exceptions';

@Injectable()
export class AlbumService {
  artistService: ArtistService;
  constructor() {
    this.artistService = new ArtistService();
  }
  create({ artistId, name, year }: CreateAlbumDto) {
    if (!name || !year || (!artistId && artistId !== null)) {
      throw new BadRequestException(ALBUMS_ERRORS.REQUIRED_FIELDS);
    }

    if (typeof name !== 'string' || typeof year !== 'number' || (typeof artistId !== 'string' && artistId !== null)) {
      throw new BadRequestException(ALBUMS_ERRORS.INVALID_BODY_FORMAT);
    }
    const newAlbum = {
      id: v4(),
      name,
      year,
      artistId: null,
    };

    if (artistId) {
      const isArtist = this.artistService.findOne(artistId);
      if (isArtist) {
        newAlbum.artistId = artistId;
      }
    }
    db.albums.push(newAlbum);

    return newAlbum;
  }

  findAll() {
    return db.albums;
  }

  findOne(id: string) {
    if (isValid(id)) {
      const album = db.albums.find(album => album.id === id);
      if (album) {
        return album;
      } else throw new NotFoundException(ALBUMS_ERRORS.ALBUM_NOT_FOUND);
    }
    throw new BadRequestException(ALBUMS_ERRORS.INVALID_ID);
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const { name, year, artistId } = updateAlbumDto;
    if (
      (name && typeof name !== 'string') ||
      (year && typeof year !== 'number') ||
      (typeof artistId !== 'string' && artistId !== null) ||
      artistId === ''
    ) {
      throw new BadRequestException(ALBUMS_ERRORS.INVALID_BODY_FORMAT);
    }
    if (artistId) {
      this.artistService.findOne(artistId);
    }

    if (isValid(id)) {
      const index = db.albums.findIndex(album => album.id === id);
      if (index !== -1) {
        const updateAlbum = db.albums[index];
        db.albums[index] = { ...updateAlbum, ...updateAlbumDto };
        return db.albums[index];
      } else throw new NotFoundException(ALBUMS_ERRORS.ALBUM_NOT_FOUND);
    }
    throw new BadRequestException(ALBUMS_ERRORS.INVALID_ID);
  }

  remove(id: string) {
    if (isValid(id)) {
      const album = db.albums.find(album => album.id === id);
      if (album) {
        db.albums = db.albums.filter(album => album.id !== id);
        return;
      } else throw new NotFoundException(ALBUMS_ERRORS.ALBUM_NOT_FOUND);
    }
    throw new BadRequestException(ALBUMS_ERRORS.INVALID_ID);
  }
}
