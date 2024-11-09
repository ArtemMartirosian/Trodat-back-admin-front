import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { CreateAdminDto, LoginAdminDto } from './dto';
import { UserRole } from './enums';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(data) {
    const user = new this.userModel(data);
    return await user.save();
  }

  async findByEmail(email: string) {
    const user = this.userModel.findOne({
      where: {
        email: email,
      },
    });

    return user;
  }

  async createAdmin(data: CreateAdminDto) {
    const user = this.findByEmail(data.email);

    if (user) {
      throw new BadRequestException('User with this email already exist');
    }

    data.role = UserRole.ADMIN;

    return await this.create(data);
  }

  async loginAdmin(data: LoginAdminDto) {
    if (data.username !== 'admin') {
      throw new BadRequestException('Username or password wrong');
    }
    if (data.password !== '8R22y87R') {
      throw new BadRequestException('Username or password wrong');
    }

    return {
      isLogin: true,
    };
  }
}
