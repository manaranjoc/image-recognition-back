import {
  Body,
  Controller,
  HttpCode,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageService } from './image.service';
import { ImageRequestDto } from './dto/image-request.dto';
import { ImageResponseDto } from './dto/image-response.dto';
import { ManifestRequestDto } from './dto/manifest-request.dto';

@Controller('api/v1/images')
export class ImageController {
  constructor(private readonly appService: ImageService) {}

  @Post()
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('image'))
  async getLabels(
    @Body() configImage: ImageRequestDto,
    @UploadedFile() image,
  ): Promise<ImageResponseDto[]> {
    return await this.appService.getLabels({
      Image: { Bytes: image.buffer },
      ...configImage,
    });
  }

  @Post('upload-image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@UploadedFile() image) {
    await this.appService.saveImage(image);
  }

  @Post('upload-manifest')
  async uploadManifest(@Body() manifest: ManifestRequestDto) {
    await this.appService.saveManifest(manifest);
  }
}
