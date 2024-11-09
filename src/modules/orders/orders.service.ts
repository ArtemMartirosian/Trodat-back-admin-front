import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Orders } from './schemas/orders.schema';
import { ProductsService } from '../products/products.service';
import { CustomerService } from '../customer/customer.service'; // Import CustomerService

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Orders.name) private readonly ordersModel: Model<Orders>,
    private readonly productsService: ProductsService,
    private readonly customerService: CustomerService, // Inject CustomerService
  ) {}

  async createOrder(
    orderData: { id: string; count: number }[],
    userId: string,
  ) {
    let totalPrice = 0;

    try {
      const products = await Promise.all(
        orderData.map(async (item) => {
          const product = await this.productsService.getProductById(item.id);
          if (!product) {
            throw new NotFoundException(`Product with ID ${item.id} not found`);
          }
          totalPrice += product.price * item.count;
          return { id: item.id, count: item.count };
        }),
      );

      const customer = await this.customerService.findById(userId);
      if (!customer) {
        throw new NotFoundException('Customer not found');
      }

      const order = new this.ordersModel({
        products,
        totalPrice,
        customerName: customer.firstname + ' ' + customer.lastname,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        customerLastName: customer.lastname,
        status: 'В ожидании', // Default status is pending
      });

      await order.save();

      return { order, totalPrice };
    } catch (error) {
      console.error('Error creating order:', error);
      throw new HttpException(
        'Failed to create order',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllOrders() {
    return this.ordersModel.find().lean().exec();
  }

  async deleteOrder(id: string) {
    try {
      const result = await this.ordersModel.deleteOne({ _id: id }).exec();
      if (result.deletedCount === 0) {
        throw new NotFoundException('Order not found');
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      throw new HttpException(
        'Failed to delete order',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateOrderStatus(id: string, status: string) {
    const validStatuses = ['В ожидании', 'Отправлен', 'Доставлен', 'Отменен'];
    if (!validStatuses.includes(status)) {
      throw new HttpException('Invalid status', HttpStatus.BAD_REQUEST);
    }

    try {
      const result = await this.ordersModel
        .updateOne({ _id: id }, { $set: { status } })
        .exec();

      if (result.matchedCount === 0) {
        throw new NotFoundException('Order not found');
      }

      return { message: 'Order status updated successfully' };
    } catch (error) {
      console.error('Error updating order status:', error);
      throw new HttpException(
        'Failed to update order status',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
