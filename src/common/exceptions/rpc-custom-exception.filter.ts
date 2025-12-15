import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter<RpcException>{

  catch(exception:RpcException, host:ArgumentsHost){
    const ctx      = host.switchToHttp();
    const response = ctx.getResponse();
    const rpcError:any = exception.getError();

    console.log(rpcError.toString());
    if( rpcError.toString().includes('Empty response')){
      return response.status(500).json({
        status:500,
        message: rpcError.toString()
      })
    }

    if(
      typeof rpcError === 'object' &&
      'status' in rpcError &&
      'message' in rpcError
    ){
      const status = isNaN(+rpcError.status) ? 400 : +rpcError.status;
      return response.status(status).json(rpcError);
    }

    response.status(400).json({
      statusCode: 400,
      message: rpcError
    })

  }
}