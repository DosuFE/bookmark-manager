import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Bookmarks {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  url: string;

  @Column('simple-array', { nullable: true })
  tags: string[];

  @Column()
  favicon: string;

  @Column()
  viewCount: number;

  @Column()
  lastVisited: Date;

  @Column()
  dateAdded: Date;

  @Column({ name: 'archvied', default: false })
  archived: boolean;

  @Column({ default: false })
  pinned: boolean;
}
