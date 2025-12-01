import { BadRequestException, Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {

  constructor(
    @Inject('PRODUCT_SERVICE') private readonly productsClient: ClientProxy
  ) {}

  @Post()
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productsClient.send({cmd: 'create-product'}, createProductDto);
  }

  @Get()
  findAllProducts( @Query() paginationDto: PaginationDto ){
    return this.productsClient.send({ cmd: 'findAll-products' }, paginationDto);
  }


  @Get(":id")
  async findOneProduct( @Param('id') id: string ){

    return this.productsClient.send({ cmd: 'findOne-product' }, {id})
    .pipe(
      catchError(err => { throw new RpcException(err) })
    )

    // try{

    //   const product = await firstValueFrom(
    //     this.productClient.send({ cmd: 'findOne-product' }, {id})
    //   )

    //   return product;
      
    // }catch(error){
    //   // throw new BadRequestException(error);
    //   throw new RpcException(error);
    // }
  }


  @Patch(":id")
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto
  ){
    return this.productsClient.send(
      { cmd: 'update-product' }, 
      {id, ...updateProductDto}
    )
    .pipe(
      catchError(err => { throw new RpcException(err) })
    )
  }


  @Delete(":id")
  removeProduct( @Param('id', ParseIntPipe) id: number){
    return this.productsClient.send({ cmd: 'delete-product' }, {id})
    .pipe(
      catchError(err => { throw new RpcException(err) })
    )
  }
}
