import React, { useState, useCallback } from 'react';
import { Upload, message, Card, Image, Button, Space } from 'antd';
import { InboxOutlined, DeleteOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import type { UploadChangeParam } from 'antd/es/upload/interface';
import type { UploadedFile } from '../types/index';
import { layoutStyles, colors } from '../styles/layout';

const { Dragger } = Upload;

interface ImageUploaderProps {
  onFileSelect: (file: UploadedFile) => void;
  onFileRemove: () => void;
  selectedFile?: UploadedFile;
  title: string;
  maxSize?: number; // MB
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onFileSelect,
  onFileRemove,
  selectedFile,
  title,
  maxSize = 50
}) => {
  const [, setUploading] = useState(false);

  const beforeUpload = useCallback((file: File) => {
    // 检查文件类型
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('只能上传图片文件！');
      return false;
    }

    // 检查文件大小
    const isLtMaxSize = file.size / 1024 / 1024 < maxSize;
    if (!isLtMaxSize) {
      message.error(`图片大小不能超过 ${maxSize}MB！`);
      return false;
    }

    // 支持的格式检查
    const supportedFormats = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp'];
    if (!supportedFormats.includes(file.type)) {
      message.error('只支持 JPEG、PNG、GIF、BMP 格式的图片！');
      return false;
    }

    return true;
  }, [maxSize]);

  const handleChange: UploadProps['onChange'] = useCallback((info: UploadChangeParam) => {
    const { status } = info.file;
    
    if (status === 'uploading') {
      setUploading(true);
    } else if (status === 'done') {
      setUploading(false);
      message.success(`${info.file.name} 上传成功`);
    } else if (status === 'error') {
      setUploading(false);
      message.error(`${info.file.name} 上传失败`);
    }
  }, []);

  const customRequest = useCallback(async (options: any) => {
    const { file, onSuccess, onError } = options;
    
    try {
      setUploading(true);
      
      // 创建预览URL
      const preview = URL.createObjectURL(file);
      
      // 创建文件对象
      const uploadedFile: UploadedFile = {
        file,
        preview,
        id: Date.now().toString()
      };
      
      // 通知父组件
      onFileSelect(uploadedFile);
      
      // 模拟上传成功
      setTimeout(() => {
        onSuccess('ok');
        setUploading(false);
      }, 100);
      
    } catch (error) {
      console.error('上传失败:', error);
      onError(error);
      setUploading(false);
    }
  }, [onFileSelect]);

  const handleRemove = useCallback(() => {
    if (selectedFile) {
      URL.revokeObjectURL(selectedFile.preview);
      onFileRemove();
    }
  }, [selectedFile, onFileRemove]);

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    showUploadList: false,
    beforeUpload,
    onChange: handleChange,
    customRequest,
    accept: 'image/*'
  };

  return (
    <Card title={title} style={layoutStyles.uploaderCard}>
      {selectedFile ? (
        <div style={layoutStyles.previewContainer}>
          <Image
            src={selectedFile.preview}
            alt="预览"
            style={layoutStyles.imagePreview}
            preview={{
              mask: '点击预览'
            }}
          />
          <div style={{ marginBottom: '8px' }}>
            <strong>{selectedFile.file.name}</strong>
          </div>
          <div style={{ 
            color: colors.text.secondary, 
            fontSize: '12px', 
            marginBottom: '16px' 
          }}>
            大小: {(selectedFile.file.size / 1024 / 1024).toFixed(2)} MB
          </div>
          <Space>
            <Button 
              type="primary" 
              danger 
              icon={<DeleteOutlined />}
              onClick={handleRemove}
            >
              移除
            </Button>
          </Space>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <Dragger {...uploadProps} style={layoutStyles.draggerArea}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined style={{ fontSize: '48px', color: colors.primary }} />
            </p>
            <p className="ant-upload-text" style={{ fontSize: '16px', marginBottom: '8px' }}>
              点击或拖拽图片到此区域上传
            </p>
            <p className="ant-upload-hint" style={{ color: colors.text.secondary }}>
              支持 JPEG、PNG、GIF、BMP 格式，单个文件不超过 {maxSize}MB
            </p>
          </Dragger>
        </div>
      )}
    </Card>
  );
};

export default ImageUploader;