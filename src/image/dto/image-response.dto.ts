export class ImageResponseDto {
  Name: string;
  Confidence: number;
  Instances: Instance[];
  Parents: Parent[];
}

class BoundingBox {
  Width: number;
  Height: number;
  Left: number;
  Top: number;
}

class Instance {
  BoundingBox: BoundingBox;
  Confidence: number;
}

class Parent {
  Name: string;
}
