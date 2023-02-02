import { Injectable } from '@nestjs/common';
import { BadRequestException, NotFoundException } from '@nestjs/common/exceptions';
import { v4 } from 'uuid';

import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { ARTISTS_ERRORS, isValid } from './../utils/constantsAndHelpers';
import { db } from 'src/database/db';

@Injectable()
export class ArtistService {
  create({ name, grammy }: CreateArtistDto) {
    if (grammy && name) {
      if (typeof grammy !== 'boolean' || typeof name !== 'string') {
        throw new BadRequestException(ARTISTS_ERRORS.INVALID_BODY_FORMAT);
      }

      const newArtist = {
        id: v4(),
        name,
        grammy,
      };
      db.artists.push(newArtist);

      return newArtist;
    }
    throw new BadRequestException(ARTISTS_ERRORS.REQUIRED_FIELDS);
  }

  findAll() {
    return db.artists;
  }

  findOne(id: string) {
    if (isValid(id)) {
      const artist = db.artists.find(artist => artist.id === id);
      if (artist) {
        return artist;
      } else throw new NotFoundException(ARTISTS_ERRORS.ARTIST_NOT_FOUND);
    }
    throw new BadRequestException(ARTISTS_ERRORS.INVALID_ID);
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    if (!updateArtistDto.name && !updateArtistDto.grammy) {
      throw new BadRequestException(ARTISTS_ERRORS.REQUIRED_FIELDS);
    }

    if (
      (updateArtistDto.name && typeof updateArtistDto.name !== 'string') ||
      (updateArtistDto.grammy && typeof updateArtistDto.grammy !== 'boolean')
    ) {
      throw new BadRequestException(ARTISTS_ERRORS.INVALID_BODY_FORMAT);
    }

    if (isValid(id)) {
      const index = db.artists.findIndex(artist => artist.id === id);
      if (index !== -1) {
        const updatedArtist = db.artists[index];
        db.artists[index] = { ...updatedArtist, ...updateArtistDto };
        return db.artists[index];
      } else throw new NotFoundException(ARTISTS_ERRORS.ARTIST_NOT_FOUND);
    }
    throw new BadRequestException(ARTISTS_ERRORS.INVALID_ID);
  }

  remove(id: string) {
    if (isValid(id)) {
      const artist = db.artists.find(artist => artist.id === id);
      if (artist) {
        db.artists = db.artists.filter(artist => artist.id !== id);
        return;
      } else throw new NotFoundException(ARTISTS_ERRORS.ARTIST_NOT_FOUND);
    }
    throw new BadRequestException(ARTISTS_ERRORS.INVALID_ID);
  }
}
