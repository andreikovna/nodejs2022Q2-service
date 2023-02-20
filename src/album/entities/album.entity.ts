import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export interface IAlbum {
  id: string;
  name: string;
  year: number;
  artistId: string | null;
}

@Entity()
export class Album {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column()
  name: string;

  @Column()
  year: number;

  @Column({ nullable: true })
  artistId: string | null;
}
