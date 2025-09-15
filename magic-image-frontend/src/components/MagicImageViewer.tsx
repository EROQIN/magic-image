import React, { useState, useCallback } from 'react';
import { 
  Card, 
  Button, 
  Space, 
  Typography, 
  Alert, 
  Descriptions, 
  Image, 
  Row, 
  Col, 
  Divider,
  Radio,
  Progress
} from 'antd';
import { 
  EyeOutlined, 
  DownloadOutlined, 
  ExperimentOutlined,
  ReloadOutlined,
  FileImageOutlined 
} from '@ant-design/icons';
import ImageUploader from './ImageUploader';
import type { UploadedFile, MagicImageAnalysis, ProcessingStatus } from '../types/index';
import { MagicImageProcessor } from '../utils/MagicImageProcessor';
import { layoutStyles, uploaderBreakpoints, gutterConfig, colors } from '../styles/layout';

const { Title, Text } = Typography;

type ViewMode = 'normal' | 'magic' | 'analyze';

const MagicImageViewer: React.FC = () => {
  const [magicImage, setMagicImage] = useState<UploadedFile | undefined>();
  const [viewMode, setViewMode] = useState<ViewMode>('analyze');
  const [status, setStatus] = useState<ProcessingStatus>({
    isProcessing: false,
    progress: 0,
    message: ''
  });
  const [analysis, setAnalysis] = useState<MagicImageAnalysis | null>(null);
  const [extractedBlob, setExtractedBlob] = useState<Blob | null>(null);
  const [extractedPreview, setExtractedPreview] = useState<string>('');
  const [processor] = useState(() => new MagicImageProcessor());

  const handleImageSelect = useCallback((file: UploadedFile) => {
    setMagicImage(file);
    setAnalysis(null);
    setExtractedBlob(null);
    if (extractedPreview) {
      URL.revokeObjectURL(extractedPreview);
      setExtractedPreview('');
    }
  }, [extractedPreview]);

  const handleImageRemove = useCallback(() => {
    if (magicImage) {
      URL.revokeObjectURL(magicImage.preview);
      setMagicImage(undefined);
    }
    setAnalysis(null);
    setExtractedBlob(null);
    if (extractedPreview) {
      URL.revokeObjectURL(extractedPreview);
      setExtractedPreview('');
    }
  }, [magicImage, extractedPreview]);

  const analyzeMagicImage = useCallback(async () => {
    if (!magicImage) return;

    setStatus({
      isProcessing: true,
      progress: 0,
      message: '开始分析...'
    });

    try {
      setStatus(prev => ({ ...prev, progress: 30, message: '读取文件数据...' }));
      await new Promise(resolve => setTimeout(resolve, 300));

      setStatus(prev => ({ ...prev, progress: 60, message: '分析图片结构...' }));
      const result = await processor.analyzeMagicImage(magicImage.file);

      setStatus(prev => ({ ...prev, progress: 100, message: '分析完成！' }));
      setAnalysis(result);

      setTimeout(() => {
        setStatus({
          isProcessing: false,
          progress: 0,
          message: ''
        });
      }, 500);

    } catch (error) {
      console.error('分析失败:', error);
      setStatus({
        isProcessing: false,
        progress: 0,
        message: '',
        error: error instanceof Error ? error.message : '分析失败'
      });
    }
  }, [magicImage, processor]);

  const extractImage = useCallback(async () => {
    if (!magicImage) return;

    setStatus({
      isProcessing: true,
      progress: 0,
      message: '开始提取...'
    });

    try {
      let blob: Blob | null = null;
      
      if (viewMode === 'normal') {
        setStatus(prev => ({ ...prev, progress: 50, message: '提取第一张图片...' }));
        blob = await processor.extractFirstImage(magicImage.file);
      } else if (viewMode === 'magic') {
        setStatus(prev => ({ ...prev, progress: 50, message: '提取隐藏图片...' }));
        blob = await processor.extractHiddenImage(magicImage.file);
      }

      if (blob) {
        setStatus(prev => ({ ...prev, progress: 100, message: '提取成功！' }));
        setExtractedBlob(blob);
        
        // 创建预览URL
        if (extractedPreview) {
          URL.revokeObjectURL(extractedPreview);
        }
        const preview = URL.createObjectURL(blob);
        setExtractedPreview(preview);
      } else {
        throw new Error('未找到可提取的图片');
      }

      setTimeout(() => {
        setStatus({
          isProcessing: false,
          progress: 0,
          message: ''
        });
      }, 500);

    } catch (error) {
      console.error('提取失败:', error);
      setStatus({
        isProcessing: false,
        progress: 0,
        message: '',
        error: error instanceof Error ? error.message : '提取失败'
      });
    }
  }, [magicImage, viewMode, processor, extractedPreview]);

  const downloadExtracted = useCallback(() => {
    if (extractedBlob && magicImage) {
      const suffix = viewMode === 'normal' ? '_first' : '_hidden';
      const filename = `extracted${suffix}_${magicImage.file.name}`;
      processor.downloadBlob(extractedBlob, filename);
    }
  }, [extractedBlob, magicImage, viewMode, processor]);

  const reset = useCallback(() => {
    if (magicImage) {
      URL.revokeObjectURL(magicImage.preview);
    }
    if (extractedPreview) {
      URL.revokeObjectURL(extractedPreview);
    }
    setMagicImage(undefined);
    setAnalysis(null);
    setExtractedBlob(null);
    setExtractedPreview('');
    setStatus({
      isProcessing: false,
      progress: 0,
      message: ''
    });
  }, [magicImage, extractedPreview]);

  const canProcess = magicImage && !status.isProcessing;

  return (
    <div style={layoutStyles.pageContainer}>
      <div style={layoutStyles.contentContainer}>
        <Card style={layoutStyles.mainCard}>
          <Title level={2} style={layoutStyles.title}>
            <EyeOutlined style={{ marginRight: '8px', color: colors.primary }} />
            魔法图片查看器
          </Title>
          
          <Text type="secondary" style={layoutStyles.subtitle}>
            分析魔法图片结构，提取隐藏的图片内容
          </Text>

          <div style={layoutStyles.uploaderSection}>
            <Row gutter={[gutterConfig.horizontal, gutterConfig.vertical]}>
              <Col {...uploaderBreakpoints}>
                <ImageUploader
                  title="上传魔法图片"
                  onFileSelect={handleImageSelect}
                  onFileRemove={handleImageRemove}
                  selectedFile={magicImage}
                />
              </Col>
              
              <Col {...uploaderBreakpoints}>
                <Card title="操作选项" style={{ height: '100%' }}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div>
                      <Text strong>查看模式:</Text>
                      <Radio.Group 
                        value={viewMode} 
                        onChange={(e) => setViewMode(e.target.value)}
                        style={{ marginTop: '8px', display: 'block' }}
                      >
                        <Space direction="vertical">
                          <Radio value="analyze">
                            <ExperimentOutlined /> 分析模式 - 分析图片结构
                          </Radio>
                          <Radio value="normal">
                            <FileImageOutlined /> 普通模式 - 显示第一张图片
                          </Radio>
                          <Radio value="magic">
                            <EyeOutlined /> 魔法模式 - 显示隐藏图片
                          </Radio>
                        </Space>
                      </Radio.Group>
                    </div>

                    <Divider />

                    <Space>
                      {viewMode === 'analyze' ? (
                        <Button
                          type="primary"
                          icon={<ExperimentOutlined />}
                          onClick={analyzeMagicImage}
                          disabled={!canProcess}
                          loading={status.isProcessing}
                        >
                          分析图片
                        </Button>
                      ) : (
                        <Button
                          type="primary"
                          icon={<EyeOutlined />}
                          onClick={extractImage}
                          disabled={!canProcess}
                          loading={status.isProcessing}
                        >
                          提取图片
                        </Button>
                      )}
                      
                      <Button
                        icon={<ReloadOutlined />}
                        onClick={reset}
                      >
                        重置
                      </Button>
                    </Space>
                  </Space>
                </Card>
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

          {/* 分析结果 */}
          {analysis && (
            <Card title="分析结果" style={{ marginBottom: '16px' }}>
              <Descriptions bordered column={2}>
                <Descriptions.Item label="文件总大小">
                  {(analysis.totalSize / 1024 / 1024).toFixed(2)} MB
                </Descriptions.Item>
                <Descriptions.Item label="图片数量">
                  {analysis.images.length} 张
                </Descriptions.Item>
                <Descriptions.Item label="文件类型" span={2}>
                  {analysis.isMagicImage ? (
                    <Text type="success">魔法图片 ✨</Text>
                  ) : (
                    <Text>普通图片</Text>
                  )}
                </Descriptions.Item>
              </Descriptions>

              {analysis.images.length > 0 && (
                <div style={{ marginTop: '16px' }}>
                  <Title level={4}>图片详情:</Title>
                  {analysis.images.map((img, index) => (
                    <Card 
                      key={index} 
                      size="small" 
                      title={`图片 ${img.index}`}
                      style={{ marginBottom: '8px' }}
                    >
                      <Row gutter={16}>
                        <Col span={6}>格式: {img.format}</Col>
                        <Col span={6}>起始位置: {img.startPosition}</Col>
                        <Col span={6}>结束位置: {img.endPosition}</Col>
                        <Col span={6}>大小: {(img.size / 1024 / 1024).toFixed(2)} MB</Col>
                      </Row>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          )}

          {/* 提取结果 */}
          {extractedBlob && extractedPreview && (
            <Card title="提取结果" style={{ marginBottom: '16px' }}>
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Image
                    src={extractedPreview}
                    alt="提取的图片"
                    style={{ width: '100%', maxHeight: '300px', objectFit: 'contain' }}
                    preview={{
                      mask: '点击预览'
                    }}
                  />
                </Col>
                <Col xs={24} md={12}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Text strong>
                      {viewMode === 'normal' ? '第一张图片' : '隐藏图片'}
                    </Text>
                    <Text>
                      大小: {(extractedBlob.size / 1024 / 1024).toFixed(2)} MB
                    </Text>
                    <Text>
                      类型: {extractedBlob.type}
                    </Text>
                    <Button
                      type="primary"
                      icon={<DownloadOutlined />}
                      onClick={downloadExtracted}
                      style={{ marginTop: '16px' }}
                    >
                      下载图片
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Card>
          )}
        </Card>
      </div>
    </div>
  );
};

export default MagicImageViewer;