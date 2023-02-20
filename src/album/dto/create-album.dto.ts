import { IsNotEmpty, IsString, IsNumber, IsUUID, ValidateIf } from 'class-validator';

export class CreateAlbumDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  year: number;

  @ValidateIf(item => item.artistId !== null)
  @IsUUID()
  artistId: string | null;
}
