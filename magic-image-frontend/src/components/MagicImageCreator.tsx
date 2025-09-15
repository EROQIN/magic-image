import React, { useState, useCallback } from 'react';
import { Row, Col, Button, Card, Progress, Alert, Space, Typography, Divider } from 'antd';
import { DownloadOutlined, ReloadOutlined, StarOutlined } from '@ant-design/icons';
import ImageUploader from './ImageUploader';
import type { UploadedFile, ProcessingStatus } from '../types/index';
import { MagicImageProcessor } from '../utils/MagicImageProcessor';
import { layoutStyles, uploaderBreakpoints, gutterConfig, colors } from '../styles/layout';

const { Title, Text } = Typography;

const MagicImageCreator: React.FC = () => {
  const [image1, setImage1] = useState<UploadedFile | undefined>();
  const [image2, setImage2] = useState<UploadedFile | undefined>();
  const [status, setStatus] = useState<ProcessingStatus>({
    isProcessing: false,
    progress: 0,
    message: ''
  });
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [processor] = useState(() => new MagicImageProcessor());

  const handleImage1Select = useCallback((file: UploadedFile) => {
    setImage1(file);
    setResultBlob(null); // 清除之前的结果
  }, []);

  const handleImage2Select = useCallback((file: UploadedFile) => {
    setImage2(file);
    setResultBlob(null); // 清除之前的结果
  }, []);

  const handleImage1Remove = useCallback(() => {
    if (image1) {
      URL.revokeObjectURL(image1.preview);
      setImage1(undefined);
      setResultBlob(null);
    }
  }, [image1]);

  const handleImage2Remove = useCallback(() => {
    if (image2) {
      URL.revokeObjectURL(image2.preview);
      setImage2(undefined);
      setResultBlob(null);
    }
  }, [image2]);

  const createMagicImage = useCallback(async () => {
    if (!image1 || !image2) {
      return;
    }

    setStatus({
      isProcessing: true,
      progress: 0,
      message: '开始处理...'
    });

    try {
      // 模拟进度更新
      setStatus(prev => ({ ...prev, progress: 20, message: '读取第一张图片...' }));
      await new Promise(resolve => setTimeout(resolve, 500));

      setStatus(prev => ({ ...prev, progress: 40, message: '读取第二张图片...' }));
      await new Promise(resolve => setTimeout(resolve, 500));

      setStatus(prev => ({ ...prev, progress: 60, message: '合并图片数据...' }));
      const blob = await processor.createMagicImage(image1.file, image2.file);

      setStatus(prev => ({ ...prev, progress: 80, message: '生成魔法图片...' }));
      await new Promise(resolve => setTimeout(resolve, 300));

      setStatus(prev => ({ ...prev, progress: 100, message: '魔法图片创建成功！' }));
      setResultBlob(blob);

      // 延迟重置状态
      setTimeout(() => {
        setStatus({
          isProcessing: false,
          progress: 0,
          message: ''
        });
      }, 1000);

    } catch (error) {
      console.error('创建魔法图片失败:', error);
      setStatus({
        isProcessing: false,
        progress: 0,
        message: '',
        error: error instanceof Error ? error.message : '创建失败'
      });
    }
  }, [image1, image2, processor]);

  const downloadMagicImage = useCallback(() => {
    if (resultBlob && image1) {
      const filename = `magic_${image1.file.name}`;
      processor.downloadBlob(resultBlob, filename);
    }
  }, [resultBlob, image1, processor]);

  const reset = useCallback(() => {
    if (image1) {
      URL.revokeObjectURL(image1.preview);
    }
    if (image2) {
      URL.revokeObjectURL(image2.preview);
    }
    setImage1(undefined);
    setImage2(undefined);
    setResultBlob(null);
    setStatus({
      isProcessing: false,
      progress: 0,
      message: ''
    });
  }, [image1, image2]);

  const canCreate = image1 && image2 && !status.isProcessing;

  return (
    <div style={layoutStyles.pageContainer}>
      <div style={layoutStyles.contentContainer}>
        <Card style={layoutStyles.mainCard}>
          <Title level={2} style={layoutStyles.title}>
            <StarOutlined style={{ marginRight: '8px', color: colors.primary }} />
            魔法图片创建器
          </Title>
          
          <Text type="secondary" style={layoutStyles.subtitle}>
            将两张图片合并成一个魔法图片，第一张图片在普通查看器中可见，第二张图片隐藏其中
          </Text>

          <div style={layoutStyles.uploaderSection}>
            <Row gutter={[gutterConfig.horizontal, gutterConfig.vertical]}>
              <Col {...uploaderBreakpoints}>
                <ImageUploader
                  title="第一张图片（可见图片）"
                  onFileSelect={handleImage1Select}
                  onFileRemove={handleImage1Remove}
                  selectedFile={image1}
                />
              </Col>
              <Col {...uploaderBreakpoints}>
                <ImageUploader
                  title="第二张图片（隐藏图片）"
                  onFileSelect={handleImage2Select}
                  onFileRemove={handleImage2Remove}
                  selectedFile={image2}
                />
              </Col>
            </Row>
          </div>

        <Divider />

        {status.error && (
          <Alert
            message="处理失败"
            description={status.error}
            type="error"
            showIcon
            style={{ marginBottom: '16px' }}
          />
        )}

        {status.isProcessing && (
          <Card style={layoutStyles.statusCard}>
            <Progress 
              percent={status.progress} 
              status="active"
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
            />
            <Text style={{ marginTop: '8px', display: 'block' }}>{status.message}</Text>
          </Card>
        )}

        {resultBlob && (
          <Alert
            message="魔法图片创建成功！"
            description={
              <div>
                <Text>
                  魔法图片已生成，大小: {(resultBlob.size / 1024 / 1024).toFixed(2)} MB
                </Text>
                <br />
                <Text type="secondary">
                  提示: 生成的魔法图片在普通查看器中将显示第一张图片，使用魔法图片查看器可以查看隐藏的第二张图片
                </Text>
              </div>
            }
            type="success"
            showIcon
            style={{ marginBottom: '16px' }}
          />
        )}

        <div style={layoutStyles.actionSection}>
          <Space size="large">
            <Button
              type="primary"
              size="large"
              icon={<StarOutlined />}
              onClick={createMagicImage}
              disabled={!canCreate}
              loading={status.isProcessing}
            >
              创建魔法图片
            </Button>
            
            {resultBlob && (
              <Button
                type="primary"
                size="large"
                icon={<DownloadOutlined />}
                onClick={downloadMagicImage}
                style={{ backgroundColor: colors.success, borderColor: colors.success }}
              >
                下载魔法图片
              </Button>
            )}
            
            <Button
              size="large"
              icon={<ReloadOutlined />}
              onClick={reset}
            >
              重置
            </Button>
          </Space>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MagicImageCreator;