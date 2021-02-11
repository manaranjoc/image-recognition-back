import {
  Body,
  Controller,
  HttpCode,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageService } from './image.service';
import { ImageRequestDto } from './dto/image-request.dto';

@Controller('api/v1/images')
export class ImageController {
  constructor(private readonly appService: ImageService) {}

  @Post()
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('image'))
  getLabels(
    @Body() configImage: ImageRequestDto,
    @UploadedFile() image,
  ): string {
    return this.appService.getLabels({
      Image: { Bytes: image.buffer },
      ...configImage,
    });
  }
}
