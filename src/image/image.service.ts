import { Injectable } from '@nestjs/common';
import { AwsService } from '../shared/aws.service';
import { ImageLabelCommand } from './dto/image-label.command';

@Injectable()
export class ImageService {
  constructor(private awsService: AwsService) {}

  getLabels(params: ImageLabelCommand): string {
    params.MaxLabels = Number(params.MaxLabels);
    params.MinConfidence = Number(params.MinConfidence);
    this.awsService.labelImage(params);
    return 'Hello World!';
  }
}
