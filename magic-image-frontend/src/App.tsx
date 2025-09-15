import React, { useState } from 'react';
import { Layout, Menu, Typography, Space, Card, Button, Row, Col } from 'antd';
import { 
  StarOutlined, 
  EyeOutlined, 
  HomeOutlined,
  GithubOutlined,
  InfoCircleOutlined 
} from '@ant-design/icons';
import MagicImageCreator from './components/MagicImageCreator';
import MagicImageViewer from './components/MagicImageViewer';
import { layoutStyles, cardBreakpoints, gutterConfig } from './styles/layout';
import './App.css';

const { Header, Content, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;

type PageKey = 'home' | 'creator' | 'viewer';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageKey>('home');

  const menuItems = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: '首页',
    },
    {
      key: 'creator',
      icon: <StarOutlined />,
      label: '创建魔法图片',
    },
    {
      key: 'viewer',
      icon: <EyeOutlined />,
      label: '查看魔法图片',
    },
  ];

  const renderContent = () => {
    switch (currentPage) {
      case 'creator':
        return <MagicImageCreator />;
      case 'viewer':
        return <MagicImageViewer />;
      default:
        return (
          <div style={layoutStyles.pageContainer}>
            <div style={layoutStyles.contentContainer}>
            {/* 欢迎区域 */}
            <Card style={{ textAlign: 'center', marginBottom: '24px' }}>
              <Space direction="vertical" size="large">
                <Title level={1} style={{ color: '#1890ff', marginBottom: 0 }}>
                  ✨ 魔法图片工具
                </Title>
                <Paragraph style={{ fontSize: '18px', color: '#666' }}>
                  一个神奇的工具，可以将两张图片合并成一个文件，普通查看器只能看到第一张图片，
                  而使用我们的专用工具可以提取隐藏的第二张图片！
                </Paragraph>
                <Space size="large">
                  <Button 
                    type="primary" 
                    size="large"
                    icon={<StarOutlined />}
                    onClick={() => setCurrentPage('creator')}
                  >
                    开始创建
                  </Button>
                  <Button 
                    size="large"
                    icon={<EyeOutlined />}
                    onClick={() => setCurrentPage('viewer')}
                  >
                    查看魔法图片
                  </Button>
                </Space>
              </Space>
            </Card>

            {/* 功能介绍 */}
            <Row gutter={[gutterConfig.horizontal, gutterConfig.vertical]} style={{ marginBottom: '24px' }}>
              <Col {...cardBreakpoints}>
                <Card 
                  title={
                    <Space>
                      <StarOutlined style={{ color: '#1890ff' }} />
                      创建魔法图片
                    </Space>
                  }
                  hoverable
                  style={{ height: '100%' }}
                >
                  <Paragraph>
                    将两张图片合并成一个魔法图片文件：
                  </Paragraph>
                  <ul>
                    <li>第一张图片在普通查看器中可见</li>
                    <li>第二张图片隐藏在文件中</li>
                    <li>支持 PNG、JPEG、GIF、BMP 格式</li>
                    <li>拖拽上传，操作简单</li>
                  </ul>
                </Card>
              </Col>

              <Col {...cardBreakpoints}>
                <Card 
                  title={
                    <Space>
                      <EyeOutlined style={{ color: '#52c41a' }} />
                      查看魔法图片
                    </Space>
                  }
                  hoverable
                  style={{ height: '100%' }}
                >
                  <Paragraph>
                    分析和提取魔法图片中的内容：
                  </Paragraph>
                  <ul>
                    <li>分析魔法图片的内部结构</li>
                    <li>提取第一张图片（普通模式）</li>
                    <li>提取隐藏的第二张图片（魔法模式）</li>
                    <li>显示详细的分析报告</li>
                  </ul>
                </Card>
              </Col>

              <Col {...cardBreakpoints}>
                <Card 
                  title={
                    <Space>
                      <InfoCircleOutlined style={{ color: '#faad14' }} />
                      技术特点
                    </Space>
                  }
                  hoverable
                  style={{ height: '100%' }}
                >
                  <Paragraph>
                    纯前端实现，安全可靠：
                  </Paragraph>
                  <ul>
                    <li>文件不会上传到服务器</li>
                    <li>完全在浏览器中处理</li>
                    <li>支持离线使用</li>
                    <li>开源免费</li>
                  </ul>
                </Card>
              </Col>
            </Row>

            {/* 使用说明 */}
            <Card title="使用说明">
              <Row gutter={[gutterConfig.horizontal, gutterConfig.vertical]}>
                <Col {...cardBreakpoints}>
                  <Title level={4}>1. 创建魔法图片</Title>
                  <Paragraph>
                    • 点击"创建魔法图片"<br/>
                    • 上传两张图片<br/>
                    • 点击"创建魔法图片"按钮<br/>
                    • 下载生成的魔法图片
                  </Paragraph>
                </Col>
                <Col {...cardBreakpoints}>
                  <Title level={4}>2. 查看魔法图片</Title>
                  <Paragraph>
                    • 点击"查看魔法图片"<br/>
                    • 上传魔法图片文件<br/>
                    • 选择查看模式<br/>
                    • 分析或提取图片
                  </Paragraph>
                </Col>
                <Col {...cardBreakpoints}>
                  <Title level={4}>3. 注意事项</Title>
                  <Paragraph>
                    • 支持的格式：PNG、JPEG、GIF、BMP<br/>
                    • 单文件最大 50MB<br/>
                    • 建议使用现代浏览器<br/>
                    • 处理大文件时请耐心等待
                  </Paragraph>
                </Col>
              </Row>
            </Card>
            </div>
          </div>
        );
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', width: '100vw'}}>
      <Header style={{ 
        display: 'flex', 
        alignItems: 'center', 
        background: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          marginRight: '24px',
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#1890ff'
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32" style={{ marginRight: '8px' }}>
            <defs>
              <linearGradient id="magicGradientNav" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1890ff"/>
                <stop offset="50%" stopColor="#722ed1"/>
                <stop offset="100%" stopColor="#eb2f96"/>
              </linearGradient>
              <filter id="glowNav">
                <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            <circle cx="16" cy="16" r="15" fill="url(#magicGradientNav)" opacity="0.1"/>
            <rect x="6" y="8" width="14" height="10" rx="2" fill="none" stroke="url(#magicGradientNav)" strokeWidth="2"/>
            <circle cx="10" cy="12" r="1.5" fill="url(#magicGradientNav)" opacity="0.7"/>
            <path d="M8 16 L12 13 L16 15 L18 14" stroke="url(#magicGradientNav)" strokeWidth="1.5" fill="none" opacity="0.7"/>
            
            <g filter="url(#glowNav)">
              <path d="M22 6 L23 8 L25 8 L23.5 9.5 L24 12 L22 11 L20 12 L20.5 9.5 L19 8 L21 8 Z" fill="#ffd700"/>
              <path d="M26 14 L26.5 15 L27.5 15 L26.8 15.8 L27 17 L26 16.5 L25 17 L25.2 15.8 L24.5 15 L25.5 15 Z" fill="#ffd700"/>
              <path d="M24 22 L24.5 23 L25.5 23 L24.8 23.8 L25 25 L24 24.5 L23 25 L23.2 23.8 L22.5 23 L23.5 23 Z" fill="#ffd700"/>
            </g>
            
            <path d="M8 20 Q12 18 16 20 Q20 22 24 20" stroke="#ffd700" strokeWidth="1" fill="none" opacity="0.6"/>
            <path d="M6 24 Q10 22 14 24 Q18 26 22 24" stroke="#ffd700" strokeWidth="1" fill="none" opacity="0.4"/>
          </svg>
          魔法图片工具
        </div>
        <Menu
          mode="horizontal"
          selectedKeys={[currentPage]}
          items={menuItems}
          style={{ flex: 1, border: 'none' }}
          onClick={({ key }) => setCurrentPage(key as PageKey)}
        />
      </Header>

      <Content style={{ background: 'transparent', padding: 0 }}>
        {renderContent()}
      </Content>

      <Footer style={{ textAlign: 'center', background: '#fff' }}>
        <Space split={<span style={{ color: '#d9d9d9' }}>|</span>}>
          <Text type="secondary">
            魔法图片工具 ©2025 - 纯前端实现，安全可靠
          </Text>
          <Button 
            type="link" 
            icon={<GithubOutlined />} 
            href="https://github.com/EROQIN/magic-image" 
            target="_blank"
            style={{ padding: 0 }}
          >
            GitHub
          </Button>
        </Space>
      </Footer>
    </Layout>
  );
};

export default App;