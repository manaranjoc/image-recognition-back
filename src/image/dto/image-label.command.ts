export class ImageLabelCommand {
  Image: Image;
  MaxLabels?: number;
  MinConfidence?: number;
}

export class ImageCustomLabelCommand extends ImageLabelCommand {
  ProjectVersionArn: string;
}

class Image {
  Bytes: Buffer;
}
