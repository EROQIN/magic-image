import type { ImageSignature, ImageInfo, MagicImageAnalysis } from '../types/index';

export class MagicImageProcessor {
  // 图片格式魔数标记
  private readonly knownSignatures: ImageSignature[] = [
    {
      signature: [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A],
      format: 'PNG',
      extension: '.png'
    },
    {
      signature: [0xFF, 0xD8, 0xFF],
      format: 'JPEG',
      extension: '.jpg'
    },
    {
      signature: [0x47, 0x49, 0x46, 0x38],
      format: 'GIF',
      extension: '.gif'
    },
    {
      signature: [0x42, 0x4D],
      format: 'BMP',
      extension: '.bmp'
    }
  ];

  /**
   * 检测图片格式
   */
  detectImageFormat(data: Uint8Array): string {
    for (const sig of this.knownSignatures) {
      if (data.length >= sig.signature.length) {
        let match = true;
        for (let i = 0; i < sig.signature.length; i++) {
          if (data[i] !== sig.signature[i]) {
            match = false;
            break;
          }
        }
        if (match) {
          return sig.format;
        }
      }
    }
    return 'UNKNOWN';
  }

  /**
   * 查找图片签名和位置
   */
  findImageSignature(data: Uint8Array, startPos: number = 0): ImageInfo {
    const info: ImageInfo = {
      position: 0,
      format: 'UNKNOWN',
      extension: '.bin',
      found: false
    };

    for (let pos = startPos; pos < data.length; pos++) {
      for (const sig of this.knownSignatures) {
        if (pos + sig.signature.length <= data.length) {
          let match = true;
          for (let i = 0; i < sig.signature.length; i++) {
            if (data[pos + i] !== sig.signature[i]) {
              match = false;
              break;
            }
          }
          if (match) {
            info.position = pos;
            info.format = sig.format;
            info.extension = sig.extension;
            info.found = true;
            return info;
          }
        }
      }
    }
    return info;
  }

  /**
   * 智能查找下一个图片的开始位置
   */
  findNextImageStart(data: Uint8Array, afterPos: number, minGap: number = 1000): ImageInfo {
    const searchStart = afterPos + minGap;
    if (searchStart >= data.length) {
      return {
        position: 0,
        format: 'UNKNOWN',
        extension: '.bin',
        found: false
      };
    }
    return this.findImageSignature(data, searchStart);
  }

  /**
   * 创建魔法图片
   */
  async createMagicImage(image1: File, image2: File): Promise<Blob> {
    try {
      console.log('正在读取第一张图片:', image1.name);
      const image1Buffer = await image1.arrayBuffer();
      const image1Data = new Uint8Array(image1Buffer);
      const format1 = this.detectImageFormat(image1Data);
      console.log(`检测到格式: ${format1} (大小: ${image1Data.length} 字节)`);

      console.log('正在读取第二张图片:', image2.name);
      const image2Buffer = await image2.arrayBuffer();
      const image2Data = new Uint8Array(image2Buffer);
      const format2 = this.detectImageFormat(image2Data);
      console.log(`检测到格式: ${format2} (大小: ${image2Data.length} 字节)`);

      if (format1 === 'UNKNOWN' || format2 === 'UNKNOWN') {
        console.warn('警告: 检测到未知图片格式，但仍将继续处理');
      }

      // 合并两张图片的数据
      const combinedData = new Uint8Array(image1Data.length + image2Data.length);
      combinedData.set(image1Data, 0);
      combinedData.set(image2Data, image1Data.length);

      console.log('魔法图片创建成功!');
      console.log(`总大小: ${combinedData.length} 字节`);
      console.log(`第一张图片: 0 - ${image1Data.length - 1} 字节`);
      console.log(`第二张图片: ${image1Data.length} - ${combinedData.length - 1} 字节`);

      // 创建Blob对象
      const blob = new Blob([combinedData], { type: image1.type });
      return blob;

    } catch (error) {
      console.error('创建魔法图片时发生错误:', error);
      throw new Error(`创建魔法图片失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  /**
   * 提取隐藏的第二张图片
   */
  async extractHiddenImage(magicImage: File): Promise<Blob | null> {
    try {
      console.log('=== 魔法模式 ===');
      const buffer = await magicImage.arrayBuffer();
      const data = new Uint8Array(buffer);

      // 查找第一个图片签名
      const firstImage = this.findImageSignature(data, 0);
      if (!firstImage.found) {
        throw new Error('未找到有效的图片格式');
      }

      console.log('第一张图片信息:');
      console.log(`  格式: ${firstImage.format}`);
      console.log(`  起始位置: ${firstImage.position}`);

      // 智能查找第二张图片
      const secondImage = this.findNextImageStart(data, firstImage.position, 1000);
      if (!secondImage.found) {
        console.log('未找到隐藏的第二张图片');
        console.log('提示: 这可能不是一个魔法图片，或者第二张图片格式不受支持');
        return null;
      }

      const firstImageEnd = secondImage.position;
      console.log(`  结束位置: ${firstImageEnd}`);
      console.log(`  大小: ${firstImageEnd - firstImage.position} 字节`);

      console.log('找到隐藏的第二张图片:');
      console.log(`  格式: ${secondImage.format}`);
      console.log(`  起始位置: ${secondImage.position}`);

      // 查找第三张图片或使用文件结尾
      const thirdImage = this.findNextImageStart(data, secondImage.position, 1000);
      const secondImageEnd = thirdImage.found ? thirdImage.position : data.length;

      console.log(`  结束位置: ${secondImageEnd}`);
      console.log(`  大小: ${secondImageEnd - secondImage.position} 字节`);

      // 提取第二张图片数据
      const hiddenImageData = data.slice(secondImage.position, secondImageEnd);
      
      // 根据格式创建正确的MIME类型
      let mimeType = 'application/octet-stream';
      switch (secondImage.format) {
        case 'PNG':
          mimeType = 'image/png';
          break;
        case 'JPEG':
          mimeType = 'image/jpeg';
          break;
        case 'GIF':
          mimeType = 'image/gif';
          break;
        case 'BMP':
          mimeType = 'image/bmp';
          break;
      }

      const blob = new Blob([hiddenImageData], { type: mimeType });
      return blob;

    } catch (error) {
      console.error('提取隐藏图片时发生错误:', error);
      throw new Error(`提取隐藏图片失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  /**
   * 提取第一张图片（普通模式）
   */
  async extractFirstImage(magicImage: File): Promise<Blob | null> {
    try {
      console.log('=== 普通模式 ===');
      const buffer = await magicImage.arrayBuffer();
      const data = new Uint8Array(buffer);

      // 查找第一个图片签名
      const firstImage = this.findImageSignature(data, 0);
      if (!firstImage.found) {
        throw new Error('未找到有效的图片格式');
      }

      console.log('找到第一张图片:');
      console.log(`  格式: ${firstImage.format}`);
      console.log(`  起始位置: ${firstImage.position}`);

      // 智能查找下一个图片的开始位置
      const nextImage = this.findNextImageStart(data, firstImage.position, 1000);
      const firstImageEnd = nextImage.found ? nextImage.position : data.length;

      if (nextImage.found) {
        console.log(`  下一张图片开始于: ${nextImage.position}`);
      } else {
        console.log('  未找到下一张图片，使用文件结尾');
      }

      console.log(`  结束位置: ${firstImageEnd}`);
      console.log(`  大小: ${firstImageEnd - firstImage.position} 字节`);

      // 提取第一张图片数据
      const firstImageData = data.slice(firstImage.position, firstImageEnd);

      // 根据格式创建正确的MIME类型
      let mimeType = 'application/octet-stream';
      switch (firstImage.format) {
        case 'PNG':
          mimeType = 'image/png';
          break;
        case 'JPEG':
          mimeType = 'image/jpeg';
          break;
        case 'GIF':
          mimeType = 'image/gif';
          break;
        case 'BMP':
          mimeType = 'image/bmp';
          break;
      }

      const blob = new Blob([firstImageData], { type: mimeType });
      return blob;

    } catch (error) {
      console.error('提取第一张图片时发生错误:', error);
      throw new Error(`提取第一张图片失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  /**
   * 分析魔法图片结构
   */
  async analyzeMagicImage(magicImage: File): Promise<MagicImageAnalysis> {
    try {
      console.log('=== 魔法图片分析 ===');
      const buffer = await magicImage.arrayBuffer();
      const data = new Uint8Array(buffer);
      console.log(`文件总大小: ${data.length} 字节`);

      const images: MagicImageAnalysis['images'] = [];
      let searchPos = 0;
      let imageCount = 1;

      while (searchPos < data.length && imageCount <= 10) {
        const imageInfo = this.findImageSignature(data, searchPos);
        if (!imageInfo.found) {
          break;
        }

        console.log(`图片 ${imageCount}:`);
        console.log(`  格式: ${imageInfo.format}`);
        console.log(`  起始位置: ${imageInfo.position}`);

        // 查找下一张图片来确定当前图片的大小
        const nextImage = this.findNextImageStart(data, imageInfo.position, 1000);
        const imageEnd = nextImage.found ? nextImage.position : data.length;

        console.log(`  结束位置: ${imageEnd}`);
        console.log(`  大小: ${imageEnd - imageInfo.position} 字节`);

        images.push({
          index: imageCount,
          format: imageInfo.format,
          startPosition: imageInfo.position,
          endPosition: imageEnd,
          size: imageEnd - imageInfo.position
        });

        searchPos = imageEnd;
        imageCount++;
      }

      const analysis: MagicImageAnalysis = {
        totalSize: data.length,
        images,
        isMagicImage: images.length > 1
      };

      if (images.length === 0) {
        console.log('未找到任何有效的图片格式');
      } else if (images.length === 1) {
        console.log('这是一个普通图片文件');
      } else {
        console.log(`这是一个魔法图片，包含 ${images.length} 张图片`);
      }

      return analysis;

    } catch (error) {
      console.error('分析魔法图片时发生错误:', error);
      throw new Error(`分析魔法图片失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  /**
   * 下载文件
   */
  downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}