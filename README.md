# 魔法图片工具集

一个用于创建和查看魔法图片的C++工具集。魔法图片是将两张图片合并成一个文件的技术，普通查看器只能看到第一张图片，而使用专用工具可以提取隐藏的第二张图片。

## 🌐 在线试用

现在可以通过Web界面体验魔法图片工具！

**试用地址：** http://ad0c66aba8ab4b189fb07737cf61906d.ap-singapore.myide.io

**扫码访问：**

![QR Code](.codebuddy/sandbox/qr_code.png)

Web版本提供了友好的用户界面，支持：
- 拖拽上传图片
- 实时预览效果
- 一键下载魔法图片
- 响应式设计，支持各种设备

## 项目结构

```
magic-image/
├── README.md                    # 项目说明文档
├── magic_image_creator.cpp      # 魔法图片生成器源码
├── magic_image_viewer.cpp       # 魔法图片查看器源码（已修复）
├── images/                      # 图片文件目录
│   ├── magic_image_sample.jpg   # 示例魔法图片
```

## 功能特性

### 魔法图片生成器 (magic_image_creator)
- 将两张图片合并成一个魔法图片文件
- 支持 PNG, JPEG, GIF, BMP 格式
- 第一张图片在普通查看器中可见
- 第二张图片隐藏在文件中

### 魔法图片查看器 (magic_image_viewer) 
- **普通模式**：提取并显示第一张图片
- **魔法模式**：提取并显示隐藏的第二张图片  
- **分析模式**：分析魔法图片的内部结构
- **已修复的Bug**：解决了图片边界检测和字节大小计算问题

## 编译方法

```bash
# 编译生成器
g++ -std=c++11 -O2 -o magic_image_creator magic_image_creator.cpp

# 编译查看器
g++ -std=c++11 -O2 -o magic_image_viewer magic_image_viewer.cpp
```

## 使用方法

### 创建魔法图片

```bash
./magic_image_creator <第一张图片> <第二张图片> <输出文件>

# 示例
./magic_image_creator photo1.jpg photo2.png magic_image.jpg
```

### 查看魔法图片

```bash
# 普通模式（显示第一张图片）
./magic_image_viewer -n magic_image.jpg

# 魔法模式（显示隐藏图片）
./magic_image_viewer -m magic_image.jpg

# 分析模式（分析图片结构）
./magic_image_viewer -a magic_image.jpg

# 提取图片到指定文件
./magic_image_viewer -n magic_image.jpg first.jpg
./magic_image_viewer -m magic_image.jpg hidden.png
```

### 命令行选项

**魔法图片查看器选项：**
- `-n, --normal`：普通模式（默认）
- `-m, --magic`：魔法模式
- `-a, --analyze`：分析模式
- `-h, --help`：显示帮助信息

## 示例输出

### 分析模式输出
```
=== 魔法图片分析 (最终修复版) ===
文件总大小: 229679 字节

图片 1:
  格式: JPEG
  起始位置: 0
  结束位置: 144612
  大小: 144612 字节

图片 2:
  格式: JPEG
  起始位置: 144612
  结束位置: 229679
  大小: 85067 字节

这是一个魔法图片，包含 2 张图片
```

### 普通模式输出
```
=== 普通模式 (最终修复版) ===
找到第一张图片:
  格式: JPEG
  起始位置: 0
  下一张图片开始于: 144612
  结束位置: 144612
  大小: 144612 字节
图片已提取到: extracted_first_image.jpg (大小: 144612 字节)
```


## 技术原理

魔法图片的工作原理：
1. **创建过程**：将第二张图片的完整数据直接拼接到第一张图片后面
2. **普通查看**：图片查看器只读取文件开头的第一张图片
3. **魔法查看**：专用工具可以识别并提取隐藏在后面的第二张图片

## 支持的格式

- **PNG**：完整支持，包括透明度
- **JPEG**：完整支持，优化的边界检测
- **GIF**：支持静态和动画GIF
- **BMP**：支持标准BMP格式

## 系统要求

- C++11 或更高版本
- 支持的操作系统：Linux, macOS, Windows
- 编译器：GCC, Clang, MSVC

## 注意事项

1. 生成的魔法图片文件大小等于两张原图片的大小之和
2. 第一张图片应该是你希望在普通查看器中显示的图片
3. 隐藏的第二张图片只能通过魔法模式提取
4. 建议使用相同或兼容的图片格式以获得最佳效果

## 许可证

本项目采用 MIT 许可证。# magic-image
