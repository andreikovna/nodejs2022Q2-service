import { Injectable } from '@nestjs/common';
import { BadRequestException, NotFoundException } from '@nestjs/common/exceptions';

import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { ARTISTS_ERRORS, isValid } from './../utils/constantsAndHelpers';
import { InjectRepository } from '@nestjs/typeorm';
import { Artist } from './entities/artist.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ArtistService {
  constructor(
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
        return;
      } else throw new NotFoundException(ARTISTS_ERRORS.ARTIST_NOT_FOUND);
    }
    throw new BadRequestException(ARTISTS_ERRORS.INVALID_ID);
  }
}
