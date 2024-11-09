import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  HttpException,
  HttpStatus,
  UseGuards,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from '../customer/auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(AuthGuard) // Ensure this guard is correctly set up
  async createOrder(
    @Body() orderData: { id: string; count: number }[],
    @Req() request: any,
  ) {
    try {
      console.log(request.user, 'user');
      const userId = request.user._id;
      return await this.ordersService.createOrder(orderData, userId);
    } catch (error) {
      console.error('Error in createOrder controller:', error.message);
      console.error('Stack trace:', error.stack);
      throw new HttpException(
        'Failed to create order',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async getAllOrders() {
    return await this.ordersService.getAllOrders();
  }

  @Delete(':id')
  async deleteOrder(@Param('id') id: string) {
    try {
      await this.ordersService.deleteOrder(id);
      return { message: 'Order deleted successfully' };
    } catch (error) {
      console.error('Error in deleteOrder controller:', error.message);
      console.error('Stack trace:', error.stack);
      throw new HttpException(
        'Failed to delete order',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id/status')
  async updateOrderStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    try {
      return await this.ordersService.updateOrderStatus(id, status);
    } catch (error) {
      console.error('Error in updateOrderStatus controller:', error.message);
      throw new HttpException(
        'Failed to update order status',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
