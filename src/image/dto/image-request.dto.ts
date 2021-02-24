export class ImageRequestDto {
  MaxLabels?: number = 5;
  MinConfidence?: number = 80;
}

export class ImageRequestCustomDto extends ImageRequestDto {
  ProjectVersionArn: string;
}
