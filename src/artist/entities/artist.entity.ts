import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export interface IArtist {
  id: string;
  name: string;
  grammy: boolean;
}

@Entity()
export class Artist {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column()
  name: string;

  @Column()
  grammy: boolean;
}
