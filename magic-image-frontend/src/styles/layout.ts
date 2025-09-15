
// 统一的布局样式配置
export const layoutStyles = {
  // 页面容器样式
  pageContainer: {
    minHeight: '100vh',
    width: '100%',
    padding: '0', // 移除内边距，让背景铺满整个屏幕
    background: '#f5f5f5',
  },

  // 内容容器样式
  contentContainer: {
    margin: '0 auto',
    width: '100%',
    maxWidth: '1400px', // 设置最大宽度，让页面在大屏幕上居中显示
    padding: '24px', // 将原来pageContainer的内边距移到这里
  },

  // 主卡片样式
  mainCard: {
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    padding: '32px',
  },

  // 标题样式
  title: {
    textAlign: 'center' as const,
    marginBottom: '24px',
    fontSize: '28px',
    fontWeight: 600,
  },

  // 副标题样式
  subtitle: {
    display: 'block',
    textAlign: 'center' as const,
    marginBottom: '40px',
    fontSize: '16px',
    lineHeight: '1.6',
  },

  // 图片上传区域样式
  uploaderSection: {
    marginBottom: '40px',
  },

  // 操作按钮区域样式
  actionSection: {
    textAlign: 'center' as const,
    marginTop: '32px',
  },

  // 状态卡片样式
  statusCard: {
    marginBottom: '24px',
    borderRadius: '8px',
  },

  // 图片上传卡片样式
  uploaderCard: {
    height: '100%',
    minHeight: '400px', // 确保卡片有足够高度
    display: 'flex',
    flexDirection: 'column' as const,
  },

  // 图片预览容器样式
  previewContainer: {
    textAlign: 'center' as const,
    padding: '20px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
  },

  // 拖拽上传区域样式
  draggerArea: {
    padding: '40px 20px',
    minHeight: '300px',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    border: '2px dashed #d9d9d9',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
  },

  // 图片预览样式
  imagePreview: {
    maxWidth: '100%',
    maxHeight: '250px',
    marginBottom: '16px',
    borderRadius: '8px',
    objectFit: 'contain' as const,
  },
};

// 响应式断点配置 - 针对图片上传器的栅格布局
export const uploaderBreakpoints = {
  xs: 24,    // 超小屏：单列布局
  sm: 24,    // 小屏：单列布局
  md: 24,    // 中屏：单列布局
  lg: 12,    // 大屏：双列布局
  xl: 12,    // 超大屏：双列布局（保持双列以确保良好的用户体验）
  xxl: 12,   // 超超大屏：双列布局
};

// 首页功能卡片的响应式断点配置
export const cardBreakpoints = {
  xs: 24,    // 超小屏：单列布局
  sm: 24,    // 小屏：单列布局
  md: 12,    // 中屏：双列布局
  lg: 8,     // 大屏：三列布局
  xl: 8,     // 超大屏：三列布局
  xxl: 8,    // 超超大屏：三列布局
};

// 保持向后兼容的原始断点配置
export const breakpoints = uploaderBreakpoints;

// 栅格间距配置
export const gutterConfig = {
  horizontal: 32,
  vertical: 32,
};

// 颜色主题配置
export const colors = {
  primary: '#1890ff',
  success: '#52c41a',
  warning: '#faad14',
  error: '#ff4d4f',
  text: {
    primary: 'rgba(0, 0, 0, 0.85)',
    secondary: 'rgba(0, 0, 0, 0.65)',
    disabled: 'rgba(0, 0, 0, 0.25)',
  },
  background: {
    page: '#f5f5f5',
    card: '#ffffff',
    hover: '#f0f0f0',
  },
};

// 动画配置
export const animations = {
  duration: {
    fast: '0.2s',
    normal: '0.3s',
    slow: '0.5s',
  },
  easing: {
    ease: 'ease',
    easeInOut: 'ease-in-out',
    easeOut: 'ease-out',
  },
};