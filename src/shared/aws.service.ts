import { BadRequestException, Injectable } from '@nestjs/common';
import {
  RekognitionClient,
  DetectLabelsCommand,
  DetectLabelsRequest,
  CreateProjectVersionRequest,
  CreateProjectVersionCommand,
} from '@aws-sdk/client-rekognition';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class AwsService {
  private awsRekognition: RekognitionClient;
  private awsS3: S3Client;

  constructor() {
    this.awsRekognition = new RekognitionClient({
      region: process.env.AWS_REGION,
    });
    this.awsS3 = new S3Client({
      region: process.env.AWS_REGION,
    });
  }

  async labelImage(params: DetectLabelsRequest) {
    const detectLabelsCommand = new DetectLabelsCommand(params);

    const response = await this.awsRekognition.send(detectLabelsCommand);
    return response.Labels;
  }

  async saveFile(location, body) {
    const uploadParams = {
      Bucket: process.env.AWS_REKOGNITION_BUCKET,
      Key: location,
      Body: body,
    };

    try {
      const putCommand = new PutObjectCommand(uploadParams);
      await this.awsS3.send(putCommand);
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }

  async createModel(request: CreateProjectVersionRequest) {
    const createCommand = new CreateProjectVersionCommand(request);
  }
}
