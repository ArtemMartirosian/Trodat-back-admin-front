import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Customer } from './customer.schema';

@Injectable()
export class CustomerService {
  private readonly accessSecret = process.env.ACCESS_SECRET || 'accessSecret';
  private readonly refreshSecret =
    process.env.REFRESH_SECRET || 'refreshSecret';

  constructor(
    @InjectModel('Customer') private customerModel: Model<Customer>,
  ) {}
  async register(
    firstname: string,
    lastname: string,
    patronymic: string,
    phone: string,
    email: string,
    password: string,
    repeatPassword: string,
  ) {
    try {
      if (password !== repeatPassword) {
        throw new HttpException(
          'Passwords do not match',
          HttpStatus.BAD_REQUEST,
        );
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      console.log(firstname, lastname, phone, 'aaaa');

      const newCustomer = new this.customerModel({
        firstname,
        lastname,
        patronymic,
        phone,
        email,
        password: hashedPassword,
      });
      newCustomer.firstname = firstname;
      newCustomer.patronymic = patronymic;
      newCustomer.lastname = lastname;
      newCustomer.phone = phone;

      console.log('New User:', newCustomer); // Ensure this logs all fields
      const savedCustomer = await newCustomer.save();
      console.log('Saved User:', newCustomer); // Check saved data

      return savedCustomer;
    } catch (error) {
      console.error('Error during registration:', error.message);
      console.error('Stack trace:', error.stack);
      throw new HttpException(
        'Registration failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async login(email: string, password: string) {
    const user = await this.customerModel.findOne({ email });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
    }
    const accessToken = this.generateAccessToken(user._id.toString()); // Ensure _id is a string
    const refreshToken = this.generateRefreshToken(user._id.toString()); // Ensure _id is a string
    // user.refreshToken = refreshToken;
    await user.save();
    return { accessToken, refreshToken };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = jwt.verify(refreshToken, this.refreshSecret) as {
        userId: string;
      };
      const user = await this.customerModel.findById(payload.userId);
      if (!user) {
        throw new HttpException(
          'Invalid refresh token',
          HttpStatus.UNAUTHORIZED,
        );
      }
      const newAccessToken = this.generateAccessToken(user._id.toString()); // Ensure _id is a string
      return { accessToken: newAccessToken };
    } catch (error) {
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }
  }

  async getAllCustomers(): Promise<Customer[]> {
    return this.customerModel.find().exec();
  }

  async uploadProfileImage(userId: string, filename: string) {
    const user = await this.customerModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.imageUrl = `/uploads/customers/${filename}`;
    await user.save();

    return { message: 'Image uploaded successfully', imageUrl: user.imageUrl };
  }

  async findById(userId: string): Promise<Customer> {
    const user = await this.customerModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(
    userId: string,
    updateData: {
      firstname?: string;
      lastname?: string;
      patronymic?: string;
      phone?: string;
      email?: string;
    },
  ) {
    const updatedUser = await this.customerModel.findByIdAndUpdate(
      userId,
      updateData,
      { new: true },
    );
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return updatedUser;
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.customerModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new HttpException(
        'Current password is incorrect',
        HttpStatus.BAD_REQUEST,
      );
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    user.password = hashedPassword;
    await user.save();

    return { message: 'Password changed successfully' };
  }

  async delete(userId: string) {
    const result = await this.customerModel.deleteOne({ _id: userId });
    if (result.deletedCount === 0) {
      throw new NotFoundException('User not found');
    }
    return { message: 'User deleted successfully' };
  }

  generateAccessToken(userId: string) {
    return jwt.sign({ userId }, this.accessSecret, { expiresIn: '15m' });
  }

  generateRefreshToken(userId: string) {
    return jwt.sign({ userId }, this.refreshSecret, { expiresIn: '7d' });
  }
}
