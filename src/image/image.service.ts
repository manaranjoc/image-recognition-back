import { Injectable } from '@nestjs/common';
import { AwsService } from '../shared/aws.service';
import { ImageLabelCommand } from './dto/image-label.command';
import { ImageResponseDto } from './dto/image-response.dto';

@Injectable()
export class ImageService {
  constructor(private awsService: AwsService) {}

  async getLabels(params: ImageLabelCommand): Promise<ImageResponseDto[]> {
    params.MaxLabels = Number(params.MaxLabels);
    params.MinConfidence = Number(params.MinConfidence);
    return <ImageResponseDto[]>await this.awsService.labelImage(params);
  }
}
