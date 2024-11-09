// customer.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  Put,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  HttpStatus,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { AuthGuard } from './auth.guard';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';

const MAX_IMAGE_SIZE_IN_BYTES = 5 * 1024 * 1024; // 5MB

@Controller('customer')
export class CustomerController {
  constructor(private customerService: CustomerService) {}

  @Get('checkAuth')
  @UseGuards(AuthGuard)
  checkAuth(@Req() request: any) {
    return {
      message: 'Authenticated',
      user: request.user,
    };
  }

  @Get('all')
  async getAllCustomers() {
    return this.customerService.getAllCustomers();
  }

  @Post('register')
  async register(
    @Body()
    body: {
      firstname: string;
      lastname: string;
      patronymic: string;
      phone: string;
      email: string;
      password: string;
      repeatPassword: string;
    },
  ) {
    return this.customerService.register(
      body.firstname,
      body.lastname,
      body.patronymic,
      body.phone,
      body.email,
      body.password,
      body.repeatPassword,
    );
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.customerService.login(body.email, body.password);
  }

  @Put('update')
  @UseGuards(AuthGuard)
  async update(
    @Req() request: any,
    @Body()
    body: {
      firstname?: string;
      lastname?: string;
      patronymic?: string;
      phone?: string;
      email?: string;
    },
  ) {
    const userId = request.user._id;
    return this.customerService.update(userId, body);
  }

  @Delete('delete')
  @UseGuards(AuthGuard)
  async delete(@Req() request: any) {
    const userId = request.user._id;
    return this.customerService.delete(userId);
  }

  @Put('changePassword')
  @UseGuards(AuthGuard)
  async changePassword(
    @Req() request: any,
    @Body() body: { currentPassword: string; newPassword: string },
  ) {
    const userId = request.user._id;
    return this.customerService.changePassword(
      userId,
      body.currentPassword,
      body.newPassword,
    );
  }

  @Post('uploadImage')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/customers',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadProfileImage(
    @Req() request: any,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: /png|jpeg|jpg/ })
        .addMaxSizeValidator({ maxSize: MAX_IMAGE_SIZE_IN_BYTES })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    file: Express.Multer.File,
  ) {
    const userId = request.user._id;
    console.log('file', file);

    return this.customerService.uploadProfileImage(userId, file.filename);
  }

  @Post('refresh')
  async refresh(@Body() body: { refreshToken: string }) {
    return this.customerService.refresh(body.refreshToken);
  }
}
