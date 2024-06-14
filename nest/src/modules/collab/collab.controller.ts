import { Body, Controller, Post, Res, Req } from '@nestjs/common';
import { CollabService } from './collab.service';
import { Response, Request } from 'express';
import { IncomingMessage } from 'http';

@Controller('api/collaborative')
export class CollabController {
  constructor(
    private collaborativeService: CollabService
  ) {
  }

  @Post('test')
  async test(
    @Req() request: IncomingMessage,
    @Res() response: Response,
    @Body('event') event: string,
  ) {
    //console.log('request', request);
    //console.log('response', response);
    console.log('event', event);

    const secret = '459824aaffa928e05f5b1caec411ae5f';

    /*const signature = Buffer.from(request.headers['x-hocuspocus-signature-256'] as string)

    const hmac = createHmac('sha256', secret)
    const digest = Buffer.from(`sha256=${hmac.update(body).digest('hex')}`)

    return signature.length !== digest.length || timingSafeEqual(digest, signature)*/
    //return await this.authService.login(username, password);
  }
}



