import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export interface ITrack {
  id: string; // uuid v4
  name: string;
  artistId: string | null; // refers to Artist
  albumId: string | null; // refers to Album
  duration: number; // integer number
}

@Entity('track')
export class Track {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  duration: number;

  @Column({ nullable: true })
  albumId: string | null;

  @Column({ nullable: true })
  artistId: string | null;
}
