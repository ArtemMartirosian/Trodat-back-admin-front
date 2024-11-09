import { Injectable, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Browser, chromium } from 'playwright';
import { AppModule } from 'src/app.module';
import { AppConfig } from 'src/modules/config/configs';
import { ProductsService } from 'src/modules/products/products.service';

@Injectable()
export class Parser {
  private browser: Browser;
  private productService: ProductsService;
  private logger: Logger;

  constructor(productService: ProductsService) {
    this.logger = new Logger('Parser');
    this.productService = productService;
  }

  async init() {
    this.browser = await chromium.launch({
      headless: false,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
      ],
    });
  }

  async parseTrodat2(article: string) {
    const page = await this.browser.newPage();
    await page.goto('https://trodat-russia.ru/search/');

    const filterCatalog = await page.$('#filter_3');
    await filterCatalog.click();

    const searchInput = await page.$('body > main > div > div > form > input');
    await searchInput.fill(article);

    const searchButton = await page.$(
      'body > main > div > div > form > button',
    );
    await searchButton.click();
    console.log('test 1');

    await page.waitForLoadState('networkidle');
    const answerArr = await page.$$(
      'body > main > div > div > ul > li > h3 > a',
    );

    console.log(`We found ${answerArr.length} products`);
    if (!answerArr.length) {
      this.logger.warn('No element was found');
      await this.browser.close();
      return;
    }
    let usingIndex = 0;

    for (const answer of answerArr) {
      let i = 1;
      const productTitle = await answer.textContent();
      console.log(`Product ${i + 1} - ${productTitle}`);
      if (productTitle === article) usingIndex = i;
      i++;
    }

    const firstEl = answerArr[usingIndex];
    const a = await firstEl.textContent();
    console.log('a', a);
    await firstEl.click();
    await page.waitForLoadState('domcontentloaded');

    // Log the URL of the product page
    console.log('Product Page URL:', page.url(), 'hhhhhhhhhhhh');

    // Extract images from the slider on the product page
    const sliderImages = await page.$$eval('.product-slider img', (images) =>
      images.map((img) => (img as HTMLImageElement).src),
    );

    console.log('Slider Images:', sliderImages, 'jjjjjjjjjjjjjj');

    // Remove the aboutTitle element
    await page.evaluate(() => {
      const aboutTitle = document.querySelector(
        'body > main > div > div > div.product > div.product-description > div.product-text > h4',
      );
      if (aboutTitle) aboutTitle.remove();
    });

    const productDescriptionElement = await page.$(
      'body > main > div > div > div.product > div.product-description > div.product-text',
    );
    const productDescription = await productDescriptionElement.innerText();
    console.log('productDescription', productDescription);
    const normalizeDescription = productDescription.replaceAll('\n', ' ');
    console.log('normalizeDescription', normalizeDescription);

    const sizeEl = await page.$(
      'body > main > div > div > div.product > div.product-description > div.features > div > div:nth-child(1) > div:nth-child(3) > span',
    );
    const size = await sizeEl.textContent();

    console.log('test 2');
    // await this.browser.close();
    this.logger.log('Parser successfully end');
    await page.close();
    return {
      description: normalizeDescription,
      size,
      sliderImages,
    };
  }

  async parseTrodat() {
    this.logger = new Logger('Parser');
    const app = await NestFactory.createApplicationContext(AppModule);
    const appConfig = app.get(AppConfig);
    this.productService = app.get<ProductsService>(ProductsService);

    this.browser = await chromium.launch({
      headless: false,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
      ],
    });

    const page = await this.browser.newPage();
    await page.goto(appConfig.parse_url);

    const orderManagerContent = await page.$(
      '.div-footer-right .footer-block-content',
    );

    const links = await orderManagerContent.$$eval('.footer-link', (links) => {
      return links.map((link) => {
        const anchorLink = link as HTMLAnchorElement;
        return {
          url: anchorLink.href,
          category: anchorLink.textContent.trim(),
        };
      });
    });

    await this.categoryParse(links);

    await this.browser.close();
    this.logger.log('Parser successfully end');
  }

  private async categoryParse(links) {
    const products = [];

    for (const link of links) {
      const productPage = await this.browser.newPage();

      try {
        await productPage.goto(link.url);

        const categoryManager = await productPage.$('.div-box-category');
        if (categoryManager) {
          const categoryLinks = await productPage.$$eval(
            '.div-content-category',
            (elements) => {
              return elements.map((element) => {
                const anchorElement = element as HTMLAnchorElement;
                return anchorElement.href;
              });
            },
          );

          const productLinks = await this.parseCategoryLinks(
            productPage,
            categoryLinks,
          );

          await this.parseProducts(productPage, productLinks);
        } else {
          await productPage.goto(link.url);
          // await productPage.select(
          //   '.div-shopnav-right .ergebnisse-left .selector_shopnav .select-field-2',
          //   '9999',
          // );

          const productLinks = await productPage.evaluate(() => {
            const buttons = document.querySelectorAll(
              '.div-content-products .button-newsbox',
            );
            const linksArray = [];

            buttons.forEach((button) => {
              const href = button.getAttribute('href');
              linksArray.push(href);
            });

            return linksArray;
          });

          await this.parseProducts(productPage, productLinks);
        }
      } catch (error) {
        console.log(error);
        this.logger.error('Error processing category:', link.category);
      } finally {
        await productPage.close();
      }
    }

    return products;
  }

  private async parseCategoryLinks(productPage, categoryLinks) {
    let linksProduct = [];
    for (const categoryLink of categoryLinks) {
      await productPage.goto(categoryLink);
      await productPage.select(
        '.div-shopnav-right .ergebnisse-left .selector_shopnav .select-field-2',
        '9999',
      );

      const productLinks = await productPage.evaluate(() => {
        const buttons = document.querySelectorAll(
          '.div-content-products .button-newsbox',
        );
        const linksArray = [];

        buttons.forEach((button) => {
          const href = button.getAttribute('href');
          linksArray.push(href);
        });

        return linksArray;
      });

      linksProduct = linksProduct.concat(productLinks);
    }
    console.log(11111111);
    console.log(linksProduct, 111111);

    return linksProduct;
  }

  private async parseProducts(productPage, linksProduct) {
    for (const linkProduct of linksProduct) {
      await productPage.goto(linkProduct);

      const product_id = await productPage.$eval('.h1-product', (element) =>
        element.textContent.trim(),
      );
      const product_name = await productPage.$eval('.sl-product', (element) =>
        element.textContent.trim(),
      );
      const product_images = await productPage.$$eval(
        '.div-image-productdetail-slider img',
        (images) => {
          return images.map((img) => img.src);
        },
      );

      console.log(product_images, 'imagessss');

      await this.productService.createParsedProduct({
        product_id: product_id,
        name: product_name,
        images: product_images,
      });
    }
  }
}
