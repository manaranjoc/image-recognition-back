import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  CreateProjectCommand,
  CreateProjectVersionCommand,
  CreateProjectVersionRequest,
  DescribeProjectsCommand,
  DescribeProjectVersionsCommand,
  DetectCustomLabelsCommand,
  DetectCustomLabelsRequest,
  DetectLabelsCommand,
  DetectLabelsRequest,
  RekognitionClient,
  StartProjectVersionCommand,
  StopProjectVersionCommand,
} from '@aws-sdk/client-rekognition';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

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
    try {
      const createCommand = new CreateProjectVersionCommand(request);
      this.awsRekognition.send(createCommand);
    } catch (error) {
      console.log(error);
    }
  }

  async fetchModels() {
    try {
      const fetchModels = new DescribeProjectVersionsCommand({
        ProjectArn: process.env.AWS_REKOGNITION_PROJECT,
      });
      return await this.awsRekognition.send(fetchModels);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async describeProjects() {
    const describe = new DescribeProjectsCommand({});
    console.log(await this.awsRekognition.send(describe));
  }

  async startProject(projectArn: string) {
    try {
      const start = new StartProjectVersionCommand({
        ProjectVersionArn: projectArn,
        MinInferenceUnits: 1,
      });
      return await this.awsRekognition.send(start);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async stopProject(projectArn: string) {
    try {
      const start = new StopProjectVersionCommand({
        ProjectVersionArn: projectArn,
      });
      return await this.awsRekognition.send(start);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async labelCustom(params: DetectCustomLabelsRequest) {
    const detectCustomLabelsCommand = new DetectCustomLabelsCommand(params);

    const response = await this.awsRekognition.send(detectCustomLabelsCommand);
    return response.CustomLabels;
  }
}
