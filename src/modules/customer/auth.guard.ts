// auth.guard.ts
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { CustomerService } from './customer.service';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly accessSecret = process.env.ACCESS_SECRET || 'accessSecret';

  constructor(
    @Inject(CustomerService) private readonly customerService: CustomerService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new HttpException(
        'Authorization header missing',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const token = authHeader.split(' ')[1]; // Assumes Bearer token

    try {
      const decoded: any = jwt.verify(token, this.accessSecret);
      console.log(decoded, 'Decoded payload');

      // Fetch user from the database
      request.user = await this.customerService.findById(decoded.userId); // Attach user to the request
      console.log(request.user, 'User attached to request');
      return true; // Allow the request to proceed
    } catch (err) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }
}
