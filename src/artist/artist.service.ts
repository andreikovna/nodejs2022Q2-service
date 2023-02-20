import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { ARTISTS_ERRORS } from './../utils/constantsAndHelpers';
import { Artist } from './entities/artist.entity';
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
    const artist = await this.artistRepository.findOneBy({ id });
    if (artist) {
      return artist;
    } else throw new NotFoundException(ARTISTS_ERRORS.ARTIST_NOT_FOUND);
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    const updatedArtist = await this.findOne(id);
    await this.artistRepository.update({ id }, { ...updatedArtist, ...updateArtistDto });
    return await this.findOne(id);
  }

  async remove(id: string) {
    const artist = await this.findOne(id);
    if (artist) {
      const tracks = await this.trackService.findAll();
      tracks.forEach(async track => {
        if (track.artistId === id) {
          track.artistId = null;
          await this.trackService.update(track.id, track);
        }
      });

      const albums = await this.albumService.findAll();
      albums.forEach(async album => {
        if (album.artistId === id) {
          album.artistId = null;
          await this.albumService.update(album.id, album);
        }
      });
      await this.artistRepository.remove(artist);
      // db.favs.artist = db.favs.artists.filter(album => album !== id);
      return;
    } else throw new NotFoundException(ARTISTS_ERRORS.ARTIST_NOT_FOUND);
  }
}
