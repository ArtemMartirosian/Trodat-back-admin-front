import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { News } from './schemas/news.schema';
import { NewsCreateDto, NewsUpdateDto } from './dto/create-news.dto';

@Injectable()
export class NewsService {
  constructor(
    @InjectModel(News.name) private readonly newsModel: Model<News>,
  ) {}

  async getAllNews() {
    return this.newsModel.find();
  }

  async getNewsById(id: string) {
    const news = await this.newsModel.findById(id).exec();
    if (!news) {
      throw new NotFoundException(`News with ID ${id} not found`);
    }
    return news;
  }

  async createNews(data: NewsCreateDto) {
    const news = new this.newsModel({
      type: data.type,
      image: data.image,
      title: data.title,
      fullDescription: data.fullDescription,
      shortDescription: data.shortDescription,
    });
    await news.save();
    return news;
  }

  async updateNews(id: string, data: NewsUpdateDto) {
    const news = await this.newsModel.findById(id).exec();
    if (!news) {
      throw new NotFoundException(`News with ID ${id} not found`);
    }
    Object.assign(news, data);
    await news.save();
    return news;
  }

  async deleteNews(id: string) {
    await this.newsModel.deleteOne({ _id: id });
    return { id };
  }
}
