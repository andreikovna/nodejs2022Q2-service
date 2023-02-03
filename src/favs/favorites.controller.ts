import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode } from '@nestjs/common';
import { FavoritesService } from './favorites.service';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favsService: FavoritesService) {}

  @Post('track/:id')
  @HttpCode(201)
  addFavoriteTrack(@Param('id') id: string) {
    return this.favsService.addTrackToFavorites(id);
  }

  @Post('album/:id')
  @HttpCode(201)
  addFavoriteAlbum(@Param('id') id: string) {
    return this.favsService.addAlbumToFavorites(id);
  }

  @Post('artist/:id')
  @HttpCode(201)
  addFavoriteArtist(@Param('id') id: string) {
    return this.favsService.addArtistToFavorites(id);
  }

  @Get()
  findAll() {
    return this.favsService.findAll();
  }

  @Delete('track/:id')
  @HttpCode(204)
  removeFavoriteTrack(@Param('id') id: string) {
    return this.favsService.removeTrackFromFavorites(id);
  }

  @Delete('album/:id')
  @HttpCode(204)
  removeFavoriteAlbum(@Param('id') id: string) {
    return this.favsService.removeAlbumFromFavorites(id);
  }

  @Delete('artist/:id')
  @HttpCode(204)
  removeFavoriteArtist(@Param('id') id: string) {
    return this.favsService.removeArtistFromFavorites(id);
  }
}
