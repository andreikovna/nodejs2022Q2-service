import { forwardRef } from '@nestjs/common/utils';
import { Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { TrackModule } from 'src/track/track.module';
import { AlbumModule } from 'src/album/album.module';
import { FavoritesModule } from 'src/favs/favorites.module';

@Module({
  imports: [forwardRef(() => TrackModule), forwardRef(() => AlbumModule), forwardRef(() => FavoritesModule)],
  controllers: [ArtistController],
  providers: [ArtistService],
  exports: [ArtistService],
})
export class ArtistModule {}
