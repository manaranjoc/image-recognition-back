import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageRequestDto } from './dto/image-request.dto';

@Controller('api/v1/images')
export class ImageController {
  constructor(private readonly appService: ImageService) {}

  @Post()
  @HttpCode(200)
  getLabels(@Body() imageRequest: ImageRequestDto): string {
    console.log(imageRequest);
    return this.appService.getHello();
  }
}
