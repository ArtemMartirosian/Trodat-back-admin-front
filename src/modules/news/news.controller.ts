import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  ParseFilePipeBuilder,
  Patch,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsCreateDto, NewsUpdateDto } from './dto/create-news.dto';
import { FileInterceptor } from '@nestjs/platform-express';

const MAX_PROFILE_PICTURE_SIZE_IN_BYTES = 5 * 1024 * 1024;

@Controller('news')
export class NewsController {
  constructor(private readonly categoryService: NewsService) {}

  @Get()
  async getNews() {
    return await this.categoryService.getAllNews();
  }

  @Get(':id')
  async getNewsById(@Param('id') id: string) {
    return await this.categoryService.getNewsById(id);
  }

  @UseInterceptors(
    FileInterceptor('image', {
      dest: './uploads',
    }),
  )
  @Post()
  async createNews(
    @Body() data: NewsCreateDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: '.(png|jpeg|jpg)' })
        .addMaxSizeValidator({ maxSize: MAX_PROFILE_PICTURE_SIZE_IN_BYTES })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    file: Express.Multer.File,
  ) {
    console.log('data', data);
    console.log('file', file);
    return await this.categoryService.createNews({
      ...data,
      image: file.filename,
    });
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      dest: './uploads',
    }),
  )
  async updateNews(
    @Param('id') id: string,
    @Body() data: NewsUpdateDto,
    @UploadedFile() file: Express.Multer.File | undefined,
  ) {
    const existingNews = await this.categoryService.getNewsById(id);
    if (!existingNews) {
      throw new NotFoundException(`News with ID ${id} not found`);
    }

    const updateData = {
      ...data,
      image: file ? file.filename : existingNews.image,
    };

    await this.categoryService.updateNews(id, updateData);
    return await this.categoryService.getNewsById(id);
  }

  @Delete(':id')
  async deleteNews(@Param() param: { id: string }) {
    return this.categoryService.deleteNews(param.id);
  }
}
