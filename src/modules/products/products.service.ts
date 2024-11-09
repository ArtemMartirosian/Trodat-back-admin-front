import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Product } from './schemas/product.schema';
import { CreateParsedProductDto } from './dto/create-parsed-product.dto';
import { Parser } from 'src/helpers/parser';
import { downloadImagesByUrl } from 'src/helpers/utils';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios from 'axios';
import {
  ErrorIntegrationAnswer,
  IntegrationProduct,
  SuccessIntegrationAnswer,
} from '../../types/integration.type';
import { CategoryService } from '../category/category.service';
import { ParsedOptionsType, productRusFieldToEng } from './helper';
import { NewsCreateDto, NewsUpdateDto } from '../news/dto/create-news.dto';
import { IProduct } from './interfaces/products.interface';

@Injectable()
export class ProductsService {
  private parser: Parser;
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    private categoryService: CategoryService,
  ) {
    this.parser = new Parser(this);
    this.parser.init();
  }

  // async parse() {
  //   const aaa = await this.parser.parseTrodat2('4910');
  //   console.log(this.parser, 'vvvv');
  //   console.log(aaa, 'vvvv');
  //   console.log(this, 'vvv');
  //   const img = await downloadImagesByUrl([
  //     'https://paperandinkprinting.com/wp-content/uploads/2019/08/canstockphoto22402523-arcos-creator.com_-1024x1024.jpg',
  //   ]);
  //   console.log('img', img);
  // }

  async parse(article: string) {
    // Parse the product details
    const result = await this.parser.parseTrodat2(article);
    console.log(this.parser, 'Parser Instance');
    console.log(result, 'Parsed Result');

    // Assuming downloadImagesByUrl is a function that downloads images
    // and returns an array of URLs of the downloaded images
    // const imageUrls = await downloadImagesByUrl(result.imageUrls || []);
    console.log('Downloaded Images', result);

    // Find or create the product with the given article
    const product = await this.productModel.findOne({ article });

    if (!product) {
      // Create a new product if it does not exist
    } else {
      // Update existing product with new slider images
      product.oneCimages = result.sliderImages;
      await product.save();
    }

    return result;
  }

  async createProduct(data: Partial<IProduct> & { image: string }) {
    console.log(data.equipment, 5555);
    console.log(data.category, 5555);
    // console.log(JSON.parse())
    const product = new this.productModel({
      product1cId: data.product1cId,
      name: data.name,
      article: data.article,
      description: data.description,
      description1c: data.description1c,
      color: data.color || [],
      equipment: data.equipment || [],
      category: data.category || null,
      size: data.size,
      frame: data.frame,
      geometry: data.geometry,
      is_active: data.is_active ?? true, // Default to true if not provided
      image: data.image, // Assume this is the filename of the uploaded image
      price: data.price, // Include price
    });
    await product.save();
    return product;
  }

  async getProductById(id: string) {
    const product = await this.productModel.findById(id).populate('category');
    if (!product) {
      throw new BadRequestException('Product not found');
    }
    return product;
  }

  async changeCategory(productId: string, categoryId: string) {
    console.log('productId', productId);
    console.log('categoryId', categoryId);
    const product = await this.productModel.findOne({ _id: productId });
    if (!product) throw new BadRequestException('Product not found');
    console.log('product', product);
    product.category = categoryId;
    await product.save();
    return product.populate('category');
  }

  async findByProductId(id: string): Promise<Product | null> {
    try {
      return await this.productModel.findOne({
        where: {
          product_id: id,
        },
      });
    } catch (e) {
      throw new BadRequestException('Given id invalid');
    }
  }

  async create(data): Promise<Product> {
    const product = new this.productModel(data);
    return await product.save();
  }

  async createParsedProduct(data: CreateParsedProductDto) {
    const product = await this.findByProductId(data.product_id);

    if (product) {
      return;
    }

    const downloaded_images = await downloadImagesByUrl(data.images);
    // const images = await this.fileService.uploadMany(downloaded_images);

    data.is_active = false;
    // data.images = images;

    await this.create(data);
  }

  async getProducts() {
    return this.productModel.find().populate('category');
  }

  async deleteProduct(productId: string) {
    const result = await this.productModel.deleteOne({ _id: productId });
    if (result.deletedCount === 0) {
      throw new BadRequestException('Product not found');
    }
    return { message: 'Product deleted successfully' };
  }

  getParseOptions(description: string): ParsedOptionsType {
    const parsedOptions: ParsedOptionsType = {};
    const strArr = description
      .replaceAll('/t', '')
      .replaceAll('\t', '')
      .replaceAll('', '')
      .split(',');
    console.log('strArr', strArr);

    strArr.forEach((str) => {
      const splitedParams = str.split('-');
      const param = productRusFieldToEng[splitedParams[0].trim()];
      if (param) parsedOptions[param] = splitedParams[1].trim();
    });
    console.log('parsedOptions', parsedOptions);
    return parsedOptions;
  }

  async createProduct1C(
    good: IntegrationProduct,
    description = '',
    size = '',
    sliderImages: string[],
  ) {
    const options = this.getParseOptions(good.description);
    const category = await this.categoryService.getCategoryBy1cId(good.ownerID);
    if (!category) console.error(`no category for product ${good.article}`);

    const product = new this.productModel({
      product1cId: good.goodID,
      name: good.name,
      article: good.article,
      description1c: good.description,
      description,
      size,
      is_active: true,
      color: options.color ? options.color : [],
      equipment: options.equipment ? options.equipment : [],
      frame: options.frame,
      geometry: options.geometry,
      category: category?._id || null,
      oneCimages: sliderImages,
    });
    return product.save();
  }

  async checkIsProductExist(good: IntegrationProduct) {
    const product = await this.productModel.findOne({
      product1cId: good.goodID,
    });
    console.log('checkIsCategoryExist', product);
    return !!product;
  }

  async getProductsByCategoryId(categoryId: string) {
    return this.productModel.find({
      category: categoryId,
    });
  }

  async getProductsNotInCategory(categoryId: string) {
    return this.productModel.find().where('category').ne(categoryId);
  }

  async startIntegration() {
    const res = await axios.post<
      SuccessIntegrationAnswer | ErrorIntegrationAnswer
    >(
      'http://95.215.244.110/edo/hs/ext_api/execute',
      {
        auth: {
          clientID: '0adee25e-53a3-11ee-813e-005056b73475',
        },
        general: {
          method: 'goods-get',
          deviceID: '00000032-0023-0001-0001-000000000012',
        },
      },
      {
        auth: {
          username: 'AUTH_TOKEN',
          password: 'jU5gujas',
        },
        headers: {
          configName: 'test',
          configVersion: '1',
        },
      },
    );
    console.log('res', res.data);
    if (res.data.general.error) {
      throw new InternalServerErrorException('1c request is error');
    }
    const data = res.data as SuccessIntegrationAnswer;
    await this.categoryService.integrateCategory1C(data.result.goodsGroups);

    for (const good of data.result.goods) {
      const product = await this.productModel.findOne({
        article: good.article,
      });
      console.log('product', product);

      if (product) {
        const options = this.getParseOptions(good.description);
        const keys = Object.keys(options);

        keys.forEach((key) => {
          console.log('product[key]', product[key]);
          console.log('options[k', options[key]);
          if (Array.isArray(product[key])) {
            const index = product[key].findIndex((el) => el === options[key]);
            if (index === -1) product.color.push(options[key]);
          } else if (!product[key]) {
            product[key] = options[key];
          }
        });

        await product.save();
      } else {
        const parseData = await this.parser?.parseTrodat2(good?.article);
        await this.createProduct1C(
          good,
          parseData?.description,
          parseData?.size,
          parseData.sliderImages,
        );
      }
    }

    return res.data;
  }

  async updateProduct(
    id: string,
    data: {
      image: any;
      is_active?: boolean;
      color?: string[];
      description?: string;
      equipment?: string[];
      description1c?: string;
      article?: string;
      size?: string;
      name?: string;
      geometry?: string;
      product1cId?: string;
      category?: string | null;
      frame?: string;
      price?: number;
    },
  ) {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    Object.assign(product, data);
    await product.save();
    return product;
  }
}
