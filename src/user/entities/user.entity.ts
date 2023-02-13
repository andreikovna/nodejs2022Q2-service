import { Exclude, Transform } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, VersionColumn } from 'typeorm';

export interface IUser {
  id: string;
  login: string;
  password: string;
  version: number;
  createdAt: number;
  updatedAt: number;
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  login: string;

  @VersionColumn()
  version: number;
  @Transform(({ value }) => new Date(value).getTime())
  createdDate: number;

  @UpdateDateColumn()
  @Transform(({ value }) => new Date(value).getTime())
  updatedDate: number;
}
