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
    const newArtist = {
      id: v4(),
      name,
      grammy,
    };
    db.artists.push(newArtist);

    return newArtist;
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
        db.tracks.forEach(track => {
          if (track.artistId === id) {
            track.artistId = null;
          }
        });
        db.favs.artists = db.favs.artists.filter(artist => artist !== id);
        return;
      } else throw new NotFoundException(ARTISTS_ERRORS.ARTIST_NOT_FOUND);
    }
    throw new BadRequestException(ARTISTS_ERRORS.INVALID_ID);
  }
}
