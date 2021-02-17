import { Module } from '@nestjs/common';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import { AwsModule } from '../shared/aws.module';

@Module({
  imports: [AwsModule],
  controllers: [ImageController],
  providers: [ImageService],
})
export class ImageModule {}
