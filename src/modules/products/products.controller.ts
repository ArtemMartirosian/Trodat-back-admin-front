import {
  BadRequestException,
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
import { ProductsService } from './products.service';
import { Product } from './schemas/product.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { NewsUpdateDto } from '../news/dto/create-news.dto';

const MAX_PROFILE_PICTURE_SIZE_IN_BYTES = 5 * 1024 * 1024;

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseInterceptors(
    FileInterceptor('image', {
      dest: './uploads/products',
    }),
  )
  @Post()
  async createProduct(
    @Body() data: Product,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: '.(png|jpeg|jpg)' })
        .addMaxSizeValidator({ maxSize: MAX_PROFILE_PICTURE_SIZE_IN_BYTES })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    file: Express.Multer.File,
  ) {
    return await this.productsService.createProduct({
      ...data,
      image: file.filename,
    });
  }

  @Get()
  async getProducts() {
    return await this.productsService.getProducts();
  }

  @Get('parse/:article')
  async parse(@Param('article') article: string) {
    if (!article) {
      throw new BadRequestException('Article parameter is required');
    }
    return await this.productsService.parse(article);
  }

  @Get('integration')
  async integration() {
    return await this.productsService.startIntegration();
  }

  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return await this.productsService.getProductById(id);
  }

  @Get('byCategory/:categoryId')
  async getProductsByCategoryId(@Param() param: { categoryId: string }) {
    return await this.productsService.getProductsByCategoryId(param.categoryId);
  }

  @Get('notInCategory/:categoryId')
  async getProductsNotInCategory(@Param() param: { categoryId: string }) {
    return await this.productsService.getProductsNotInCategory(
      param.categoryId,
    );
  }

  @Put('changeCategory')
  async changeCategory(
    @Body() body: { categoryId: string; productId: string },
  ) {
    console.log('body', body);
    return this.productsService.changeCategory(body.productId, body.categoryId);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    return await this.productsService.deleteProduct(id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      dest: './uploads/products',
    }),
  )
  async updateNews(
    @Param('id') id: string,
    @Body() data: Partial<Product>,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const existingNews = await this.productsService.getProductById(id);
    if (!existingNews) {
      throw new NotFoundException(`News with ID ${id} not found`);
    }

    const updateData = {
      ...data,
      image: file ? file.filename : existingNews.image,
    };

    // await this.productsService.updateProduct(id, updateData);
    return await this.productsService.updateProduct(id, updateData);
  }
}
