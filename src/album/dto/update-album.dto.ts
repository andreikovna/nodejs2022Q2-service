import { IsNotEmpty, IsString, IsNumber, IsOptional, ValidateIf, IsUUID } from 'class-validator';

export class UpdateAlbumDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  year: number;

  @IsOptional()
  @ValidateIf(item => item.artistId !== null)
  @IsUUID()
  artistId: string | null;
}
