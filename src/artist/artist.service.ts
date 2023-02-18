import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { BadRequestException, NotFoundException } from '@nestjs/common/exceptions';

import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { ARTISTS_ERRORS, isValid } from './../utils/constantsAndHelpers';
import { InjectRepository } from '@nestjs/typeorm';
import { Artist } from './entities/artist.entity';
import { Repository } from 'typeorm';
import { TrackService } from 'src/track/track.service';
import { AlbumService } from 'src/album/album.service';

@Injectable()
export class ArtistService {
  constructor(
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService,
    @InjectRepository(Artist)
    private readonly artistRepository: Repository<Artist>,
  ) {}

  async create(createArtistDto: CreateArtistDto) {
    const { id } = await this.artistRepository.save(createArtistDto);
    return await this.artistRepository.findOneByOrFail({ id });
  }

  async findAll() {
    return await this.artistRepository.find();
  }

  async findOne(id: string) {
    if (isValid(id)) {
      const artist = await this.artistRepository.findOneBy({ id });
      if (artist) {
        return artist;
      } else throw new NotFoundException(ARTISTS_ERRORS.ARTIST_NOT_FOUND);
    }
    throw new BadRequestException(ARTISTS_ERRORS.INVALID_ID);
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    if (isValid(id)) {
      const updatedArtist = await this.findOne(id);
      await this.artistRepository.update({ id }, { ...updatedArtist, ...updateArtistDto });
      return await this.findOne(id);
    }
    throw new BadRequestException(ARTISTS_ERRORS.INVALID_ID);
  }

  async remove(id: string) {
    if (isValid(id)) {
      const artist = await this.findOne(id);
      if (artist) {
        this.artistRepository.remove(artist);
        const tracks = await this.trackService.findAll();
        tracks.forEach(track => {
          if (track.artistId === id) {
            track.artistId = null;
            this.trackService.update(track.id, track);
          }
        });

        const albums = await this.albumService.findAll();
        albums.forEach(album => {
          if (album.artistId === id) {
            album.artistId = null;
            this.albumService.update(album.id, album);
          }
        });
        // db.favs.artist = db.favs.artists.filter(album => album !== id);
        return;
      } else throw new NotFoundException(ARTISTS_ERRORS.ARTIST_NOT_FOUND);
    }
    throw new BadRequestException(ARTISTS_ERRORS.INVALID_ID);
  }
}
