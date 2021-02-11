import { Injectable } from '@nestjs/common';
import {
  RekognitionClient,
  DetectLabelsCommand,
  DetectLabelsRequest,
} from '@aws-sdk/client-rekognition';

@Injectable()
export class AwsService {
  private awsRekognition: RekognitionClient;

  constructor() {
    this.awsRekognition = new RekognitionClient({
      region: process.env.AWS_REGION,
    });
  }

  async labelImage(params: DetectLabelsRequest) {
    const detectLabelsCommand = new DetectLabelsCommand(params);

    try {
      const labels = await this.awsRekognition.send(detectLabelsCommand);
      console.log(labels);
    } catch (error) {
      console.error(error);
    }
  }
}
