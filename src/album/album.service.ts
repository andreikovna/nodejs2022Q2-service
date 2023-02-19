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
    if (artistId) await this.artistService.findOne(artistId);
    const { id } = await this.albumRepository.save(createAlbumDto);
    return await this.albumRepository.findOneByOrFail({ id });
  }

  async findAll() {
    return await this.albumRepository.find();
  }

  async findOne(id: string) {
    const album = await this.albumRepository.findOneBy({ id });
    if (album) {
      return album;
    } else throw new NotFoundException(ALBUMS_ERRORS.ALBUM_NOT_FOUND);
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const { artistId } = updateAlbumDto;
    if (artistId) {
      await this.artistService.findOne(artistId);
    }

    const updateAlbum = await this.findOne(id);
    await this.albumRepository.update({ id }, { ...updateAlbum, ...updateAlbumDto });
    return await this.findOne(id);
  }

  async remove(id: string) {
    const album = await this.findOne(id);
    if (album) {
      const tracks = await this.trackService.findAll();
      tracks.forEach(async track => {
        if (track.albumId === id) {
          track.albumId = null;
          await this.trackService.update(track.id, track);
        }
      });
      await this.albumRepository.remove(album);
      return;
    } else throw new NotFoundException(ALBUMS_ERRORS.ALBUM_NOT_FOUND);
  }
}
