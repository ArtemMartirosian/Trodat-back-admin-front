import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getCategories() {
    return await this.categoryService.getAllCategories();
  }

  @Get('with-products')
  async getCategoriesWithProducts() {
    return await this.categoryService.getCategoriesWithProducts(3);
  }

  @Get(':id')
  async getCategoryById(@Param('id') id: string) {
    return await this.categoryService.getCategoryById(id);
  }

  @Post()
  async createCategory(@Body() data: CreateCategoryDto) {
    return await this.categoryService.createCategory(data.name, data.isPublic);
  }

  @Patch(':id')
  async updateCategory(
    @Param('id') id: string,
    @Body() data: CreateCategoryDto,
  ) {
    return await this.categoryService.updateCategory(
      id,
      data.name,
      data.isPublic,
    );
  }

  @Delete(':id')
  async deleteCategory(@Param() param: { id: string }) {
    console.log('param', param);
    return this.categoryService.deleteCategory(param.id);
  }
}
