import { IsArray, IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateBookmarkDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  url: string;

  @IsArray()
  @IsString({ each: true })
  tags: string;

  @IsString()
  favicon: string;

  @IsNumber()
  viewCount: number;

  @IsString()
  lastVisited: string;

  @IsString()
  dateAdded: string;

  @IsBoolean()
  archived: boolean;

  @IsBoolean()
  pinned: boolean;
}
