import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Bookmarks } from './entities/bookmark.entity';

export const pgConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  url: 'postgresql://neondb_owner:npg_5Es2cLBZlnAp@ep-empty-brook-an5i74k2-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  port: 5432,
  entities: [Bookmarks],
  synchronize: true,
  ssl: {
    rejectUnauthorized: false,
  },
};
