import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { Favs } from './entities/favorites.entity';
import { Track } from 'src/track/entities/track.entity';
import { Artist } from 'src/artist/entities/artist.entity';
import { Album } from 'src/album/entities/album.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Favs]),
    TypeOrmModule.forFeature([Track]),
    TypeOrmModule.forFeature([Artist]),
    TypeOrmModule.forFeature([Album]),
  ],
  controllers: [FavoritesController],
  providers: [FavoritesService],
  exports: [FavoritesService],
})
export class FavoritesModule {}
