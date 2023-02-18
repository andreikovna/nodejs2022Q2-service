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
    if ((!artistId && artistId !== null) || (!albumId && albumId !== null)) {
      throw new BadRequestException(TRACKS_ERRORS.REQUIRED_FIELDS);
    }

    if ((typeof artistId !== 'string' && artistId !== null) || (typeof albumId !== 'string' && albumId !== null)) {
      throw new BadRequestException(TRACKS_ERRORS.INVALID_BODY_FORMAT);
    }

    if (artistId) {
      const isArtist = this.artistService.findOne(artistId);
    }
    if (albumId) {
      const isAlbum = this.albumService.findOne(albumId);
    }

    const { id } = await this.trackRepository.save(createTrackDto);
    return await this.trackRepository.findOneByOrFail({ id });
  }

  async findAll() {
    return await this.trackRepository.find();
  }

  async findOne(id: string) {
    if (isValid(id)) {
      const track = await this.trackRepository.findOneBy({ id });
      if (track) {
        return track;
      } else throw new NotFoundException(TRACKS_ERRORS.TRACK_NOT_FOUND);
    }
    throw new BadRequestException(TRACKS_ERRORS.INVALID_ID);
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
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
      const updateTrack = await this.findOne(id);
      await this.trackRepository.update({ id }, { ...updateTrack, ...updateTrackDto });
      return await this.findOne(id);
    }
    throw new BadRequestException(TRACKS_ERRORS.INVALID_ID);
  }

  async remove(id: string) {
    if (isValid(id)) {
      const track = await this.findOne(id);
      if (track) {
        this.trackRepository.remove(track);
        // db.favs.tracks = db.favs.tracks.filter(track => track !== id);        return;
      } else throw new NotFoundException(TRACKS_ERRORS.TRACK_NOT_FOUND);
    }
    throw new BadRequestException(TRACKS_ERRORS.INVALID_ID);
  }
}
