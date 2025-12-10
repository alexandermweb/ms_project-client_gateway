import { Controller, Get, Post, Body, Param, Inject, Query, ParseUUIDPipe, Patch } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { CreateOrderDto, OrderPaginationDto } from './dto';
import { OrderStatus } from './enum/order.enum';
import { NATS_SERVICE } from 'src/config';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) {}

  @Post()
  createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.client.send('create-order', createOrderDto);
  }

  @Get()
  findAllOrders( @Query() orderPaginationDto: OrderPaginationDto) {
    return this.client.send('findAll-orders', orderPaginationDto);
  }

  @Get(':id')
  findOneOrder(@Param('id', ParseUUIDPipe) id: string) {
    return this.client.send('findOne-order', {id})
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
    return this.client.send('changeOrderStatus', {id, status: orderStatus})
    .pipe(
      catchError(err => { throw new RpcException(err) })
    )
  }

}
