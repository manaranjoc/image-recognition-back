export class ImageLabelCommand {
  Image: Image;
  MaxLabels?: number;
  MinConfidence?: number;
}

class Image {
  Bytes: Buffer;
}
