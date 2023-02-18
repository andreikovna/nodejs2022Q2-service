import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export interface IFavorites {
  artists: string[]; // favorite artists ids
  albums: string[]; // favorite albums ids
  tracks: string[]; // favorite tracks ids
}

@Entity('favs')
export class Favs {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('simple-array')
  artists: string[];

  @Column('simple-array')
  albums: string[];

  @Column('simple-array')
  tracks: string[];
}
