import { IsNotEmpty, IsString, IsNumber, ValidateIf, IsUUID } from 'class-validator';

export class CreateTrackDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @ValidateIf(item => item.artistId !== null)
  @IsUUID()
  artistId: string | null;

  @ValidateIf(item => item.albumId !== null)
  @IsUUID()
  albumId: string | null;

  @IsNotEmpty()
  @IsNumber()
  duration: number;
}
