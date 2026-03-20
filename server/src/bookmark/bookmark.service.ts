import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Bookmarks } from '../entities/bookmark.entity';

import { Repository } from 'typeorm';

import { CreateBookmarkDto } from './dto/createBookmark.dto';

import { UpdateBookmarkDto } from './dto/updateBookmark.dto';

@Injectable()
export class BookmarkService {
  constructor(
    @InjectRepository(Bookmarks) private BookmarkRepo: Repository<Bookmarks>,
  ) {}
  async findOne(id: number) {
    const bookmarks = await this.BookmarkRepo.findOne({ where: { id } });
    if (!bookmarks) throw new NotFoundException();
    return bookmarks;
  }
  async findAll() {
    const bookmarks = await this.BookmarkRepo.find();
    console.log('Backend findAll() returning:', bookmarks);
    return bookmarks;
  }
  async create(dto: CreateBookmarkDto) {
    return await this.BookmarkRepo.save(dto);
  }
  async update(id: number, dto: UpdateBookmarkDto) {
    const bookmark = await this.BookmarkRepo.findOne({ where: { id } });
    if (!bookmark) throw new NotFoundException('Bookmark not found');
    Object.assign(bookmark, dto);
    return await this.BookmarkRepo.save(bookmark);
  }
  async delete(id: number) {
    const result = await this.BookmarkRepo.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Bookmark not found');
    }
    return { success: true, id };
  }
}
