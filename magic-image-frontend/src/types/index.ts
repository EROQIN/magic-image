// 图片格式签名
export interface ImageSignature {
  signature: number[];
  format: string;
  extension: string;
}

// 图片信息
export interface ImageInfo {
  position: number;
  format: string;
  extension: string;
  found: boolean;
  size?: number;
}

// 魔法图片分析结果
export interface MagicImageAnalysis {
  totalSize: number;
  images: Array<{
    index: number;
    format: string;
    startPosition: number;
    endPosition: number;
    size: number;
  }>;
  isMagicImage: boolean;
}

// 处理状态
export interface ProcessingStatus {
  isProcessing: boolean;
  progress: number;
  message: string;
  error?: string;
}

// 上传的文件信息
export interface UploadedFile {
  file: File;
  preview: string;
  id: string;
}