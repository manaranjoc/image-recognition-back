export class ManifestRequestDto {
  'source-ref': string;
  'bounding-box': BoundingBox;
  'bounding-box-metadata': BoundingBoxMetadata;
}

class BoundingBox {
  image_size: ImageSize[];
  annotations: Annotations[];
}

class ImageSize {
  width: number;
  height: number;
  depth: number;
}

class Annotations {
  class_id: number;
  top: number;
  left: number;
  width: number;
  height: number;
}

class BoundingBoxMetadata {
  objects: Confidence[];
  'class-map': Record<string, string>;
  type: string;
  'human-annotated': string;
  'creation-date': string;
  'job-name': string;
}

class Confidence {
  confidence: number;
}
