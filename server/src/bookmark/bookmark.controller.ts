import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto } from './dto/createBookmark.dto';
import { UpdateBookmarkDto } from './dto/updateBookmark.dto';
import { ParseIdPipe } from './pipes/parseIdpipes';

@Controller('bookmark')
export class BookmarkController {
  BookmarkRepo: any;
  constructor(private bookmarkService: BookmarkService) {}

  @Post()
  create(@Body() dto: CreateBookmarkDto) {
    return this.bookmarkService.create(dto);
  }

  @Get()
  findAll() {
    return this.bookmarkService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookmarkService.findOne(Number(id));
  }

  @Patch(':id')
  update(
    @Param('id', ParseIdPipe) id: number,
    @Body() body: UpdateBookmarkDto,
  ) {
    return this.bookmarkService.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id', ParseIdPipe) id: number) {
    return this.bookmarkService.delete(id);
  }
}
