import { Injectable } from '@nestjs/common';
import { AwsService } from '../shared/aws.service';
import { ImageLabelCommand } from './dto/image-label.command';
import { ImageResponseDto } from './dto/image-response.dto';
import { ManifestRequestDto } from './dto/manifest-request.dto';

@Injectable()
export class ImageService {
  constructor(private awsService: AwsService) {}

  async getLabels(params: ImageLabelCommand): Promise<ImageResponseDto[]> {
    params.MaxLabels = Number(params.MaxLabels);
    params.MinConfidence = Number(params.MinConfidence);
    return <ImageResponseDto[]>await this.awsService.labelImage(params);
  }

  async saveImage(image) {
    const location = `images/${image.originalname}`;
    await this.awsService.saveFile(location, image.buffer);
  }

  async saveManifest(manifest: ManifestRequestDto) {
    const manifestName = manifest['bounding-box-metadata']['job-name'].replace(
      /\s/g,
      '',
    );
    manifest['source-ref'] = manifest['source-ref'].replace(
      /BUCKET/,
      process.env.AWS_REKOGNITION_BUCKET,
    );
    const location = `manifest/${manifestName}.manifest`;
    await this.awsService.saveFile(location, JSON.stringify(manifest));
  }
}
