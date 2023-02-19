import { v4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { BadRequestException, NotFoundException } from '@nestjs/common/exceptions';

import { Inject } from '@nestjs/common/decorators';
import { forwardRef } from '@nestjs/common/utils';

import { AlbumService } from 'src/album/album.service';
import { ArtistService } from 'src/artist/artist.service';
import { isValid, TRACKS_ERRORS } from 'src/utils/constantsAndHelpers';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Track } from './entities/track.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TrackService {
  constructor(
    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService,
    @Inject(forwardRef(() => ArtistService))
    private readonly artistService: ArtistService,
    @InjectRepository(Track)
    private readonly trackRepository: Repository<Track>,
  ) {}

  async create(createTrackDto: CreateTrackDto) {
    const { artistId, albumId } = createTrackDto;
    if (artistId) {
      await this.artistService.findOne(artistId);
    }
    if (albumId) {
      await this.albumService.findOne(albumId);
    }

    const { id } = await this.trackRepository.save(createTrackDto);
    return await this.trackRepository.findOneByOrFail({ id });
  }

  async findAll() {
    return await this.trackRepository.find();
  }

  async findOne(id: string) {
    const track = await this.trackRepository.findOneBy({ id });
    if (track) {
      return track;
    } else throw new NotFoundException(TRACKS_ERRORS.TRACK_NOT_FOUND);
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    const { artistId, albumId } = updateTrackDto;

    if (artistId) {
      await this.artistService.findOne(artistId);
    }

    if (albumId) {
      await this.albumService.findOne(albumId);
    }

    const updateTrack = await this.findOne(id);
    await this.trackRepository.update({ id }, { ...updateTrack, ...updateTrackDto });
    return await this.findOne(id);
  }

  async remove(id: string) {
    const track = await this.findOne(id);
    if (track) {
      await this.trackRepository.remove(track);
      // db.favs.tracks = db.favs.tracks.filter(track => track !== id);        return;
    } else throw new NotFoundException(TRACKS_ERRORS.TRACK_NOT_FOUND);
  }
}
