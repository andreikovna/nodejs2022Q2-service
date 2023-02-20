import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, ParseUUIDPipe } from '@nestjs/common';
import { FavoritesService } from './favorites.service';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favsService: FavoritesService) {}

  @Post('track/:id')
  @HttpCode(201)
  async addFavoriteTrack(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.favsService.addTrackToFavorites(id);
  }

  @Post('album/:id')
  @HttpCode(201)
  async addFavoriteAlbum(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.favsService.addAlbumToFavorites(id);
  }

  @Post('artist/:id')
  @HttpCode(201)
  async addFavoriteArtist(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.favsService.addArtistToFavorites(id);
  }

  @Get()
  async findAll() {
    return await this.favsService.findAll();
  }

  @Delete('track/:id')
  @HttpCode(204)
  async removeFavoriteTrack(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.favsService.removeTrackFromFavorites(id);
  }

  @Delete('album/:id')
  @HttpCode(204)
  async removeFavoriteAlbum(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.favsService.removeAlbumFromFavorites(id);
  }

  @Delete('artist/:id')
  @HttpCode(204)
  async removeFavoriteArtist(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.favsService.removeArtistFromFavorites(id);
  }
}
