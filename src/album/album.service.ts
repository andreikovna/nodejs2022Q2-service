import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common/decorators';
import { forwardRef } from '@nestjs/common/utils';
import { BadRequestException, NotFoundException } from '@nestjs/common/exceptions';

import { ArtistService } from './../artist/artist.service';
import { isValid } from 'src/utils/constantsAndHelpers';
import { ALBUMS_ERRORS } from './../utils/constantsAndHelpers';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Album } from './entities/album.entity';
import { TrackService } from 'src/track/track.service';

@Injectable()
export class AlbumService {
  constructor(
    @Inject(forwardRef(() => ArtistService))
    private readonly artistService: ArtistService,
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
    @InjectRepository(Album)
    private readonly albumRepository: Repository<Album>,
  ) {}

  async create(createAlbumDto: CreateAlbumDto) {
    const { artistId } = createAlbumDto;
    if (!artistId && artistId !== null) {
      throw new BadRequestException(ALBUMS_ERRORS.REQUIRED_FIELDS);
    }
    if (typeof artistId !== 'string' && artistId !== null) {
      throw new BadRequestException(ALBUMS_ERRORS.INVALID_BODY_FORMAT);
    }
    const { id } = await this.albumRepository.save(createAlbumDto);
    return await this.albumRepository.findOneByOrFail({ id });
  }

  async findAll() {
    return await this.albumRepository.find();
  }

  async findOne(id: string) {
    if (isValid(id)) {
      const album = await this.albumRepository.findOneBy({ id });
      if (album) {
        return album;
      } else throw new NotFoundException(ALBUMS_ERRORS.ALBUM_NOT_FOUND);
    }
    throw new BadRequestException(ALBUMS_ERRORS.INVALID_ID);
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const { artistId } = updateAlbumDto;
    if ((typeof artistId !== 'string' && artistId !== null) || artistId === '') {
      throw new BadRequestException(ALBUMS_ERRORS.INVALID_BODY_FORMAT);
    }

    if (artistId) {
      if (isValid(id)) {
        const updateAlbum = await this.findOne(id);
        await this.albumRepository.update({ id }, { ...updateAlbum, ...updateAlbumDto });
        return await this.findOne(id);
      }
      throw new BadRequestException(ALBUMS_ERRORS.INVALID_ID);
    }
  }

  async remove(id: string) {
    if (isValid(id)) {
      const album = await this.findOne(id);
      if (album) {
        this.albumRepository.remove(album);
        const tracks = await this.trackService.findAll();
        tracks.forEach(track => {
          if (track.albumId === id) {
            track.albumId = null;
            this.trackService.update(track.id, track);
          }
        });
        // db.favs.albums = db.favs.albums.filter(album => album !== id);
        return;
      } else throw new NotFoundException(ALBUMS_ERRORS.ALBUM_NOT_FOUND);
    }
    throw new BadRequestException(ALBUMS_ERRORS.INVALID_ID);
  }
}
