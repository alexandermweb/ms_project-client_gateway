import { Controller, Get, Post, Body, Param, Inject, Query, ParseUUIDPipe, Patch } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { CreateOrderDto, OrderPaginationDto } from './dto';
import { OrderStatus } from './enum/order.enum';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject('ORDER_SERVICE') private readonly ordersClient: ClientProxy
  ) {}

  @Post()
  createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersClient.send('create-order', createOrderDto);
  }

  @Get()
  findAllOrders( @Query() orderPaginationDto: OrderPaginationDto) {
    return this.ordersClient.send('findAll-orders', orderPaginationDto);
  }

  @Get(':id')
  findOneOrder(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersClient.send('findOne-order', {id})
    .pipe(
      catchError(err => { throw new RpcException(err) })
    )
  }


  @Patch(':id')
  changeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status') orderStatus: OrderStatus
  ){
    console.log(id, orderStatus);
    return this.ordersClient.send('changeOrderStatus', {id, status: orderStatus})
    .pipe(
      catchError(err => { throw new RpcException(err) })
    )
  }

}
