import { forwardRef } from '@nestjs/common/utils';
import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { ArtistModule } from 'src/artist/artist.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Album } from './entities/album.entity';
import { TrackModule } from 'src/track/track.module';

@Module({
  imports: [TypeOrmModule.forFeature([Album]), forwardRef(() => ArtistModule), forwardRef(() => TrackModule)],
  controllers: [AlbumController],
  providers: [AlbumService],
  exports: [AlbumService],
})
export class AlbumModule {}
