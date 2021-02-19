import { Injectable } from '@nestjs/common';
import { AwsService } from '../shared/aws.service';
import { ImageLabelCommand } from './dto/image-label.command';
import { ImageResponseDto } from './dto/image-response.dto';
import { ManifestRequestDto } from './dto/manifest-request.dto';
import { CreateProjectVersionRequest } from '@aws-sdk/client-rekognition';

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

  async saveManifest(manifests: ManifestRequestDto[]) {
    const manifestName = manifests[0]['bounding-box-metadata'][
      'job-name'
    ].replace(/\s/g, '');
    const location = `manifest/${manifestName}.manifest`;

    const manifestFile = manifests.map((manifest) => {
      manifest['source-ref'] = manifest['source-ref'].replace(
        /BUCKET/,
        process.env.AWS_REKOGNITION_BUCKET,
      );
      return JSON.stringify(manifest);
    });

    await this.awsService.saveFile(location, manifestFile.join('\n'));
    this.createModel(manifestName, location).then((result) => {
      console.log(result);
      console.log('Model Trained');
    });
  }

  async createModel(projectName, manifestLocation) {
    const project: CreateProjectVersionRequest = {
      ProjectArn: process.env.AWS_REKOGNITION_PROJECT,
      VersionName: projectName,
      OutputConfig: {
        S3Bucket: process.env.AWS_REKOGNITION_BUCKET,
        S3KeyPrefix: 'models-custom',
      },
      TrainingData: {
        Assets: [
          {
            GroundTruthManifest: {
              S3Object: {
                Bucket: process.env.AWS_REKOGNITION_BUCKET,
                Name: manifestLocation,
              },
            },
          },
        ],
      },
      TestingData: { AutoCreate: true },
    };

    return await this.awsService.createModel(project);
  }

  async fetchModels() {
    return await this.awsService.fetchModels();
  }
}
