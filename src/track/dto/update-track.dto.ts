import { IsString, IsNumber, IsOptional, ValidateIf, IsUUID } from 'class-validator';

export class UpdateTrackDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @ValidateIf(item => item.artistId !== null)
  @IsUUID()
  artistId: string | null;

  @IsOptional()
  @ValidateIf(item => item.albumId !== null)
  @IsUUID()
  albumId: string | null;

  @IsOptional()
  @IsNumber()
  duration: number;
}
