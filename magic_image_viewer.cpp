#include <iostream>
#include <fstream>
#include <vector>
#include <string>
#include <cstring>

class MagicImageViewer {
private:
    // 图片格式魔数标记
    struct ImageSignature {
        std::vector<unsigned char> signature;
        std::string format;
        std::string extension;
    };
    
    std::vector<ImageSignature> knownSignatures = {
        {{0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A}, "PNG", ".png"},
        {{0xFF, 0xD8, 0xFF}, "JPEG", ".jpg"},
        {{0x47, 0x49, 0x46, 0x38}, "GIF", ".gif"},
        {{0x42, 0x4D}, "BMP", ".bmp"}
    };

public:
    // 图片信息结构
    struct ImageInfo {
        size_t position;
        std::string format;
        std::string extension;
        bool found;
    };

    // 检测图片格式和位置
    ImageInfo findImageSignature(const std::vector<unsigned char>& data, size_t startPos = 0) {
        ImageInfo info = {0, "UNKNOWN", ".bin", false};
        
        for (size_t pos = startPos; pos < data.size(); ++pos) {
            for (const auto& sig : knownSignatures) {
                if (pos + sig.signature.size() <= data.size()) {
                    bool match = true;
                    for (size_t i = 0; i < sig.signature.size(); ++i) {
                        if (data[pos + i] != sig.signature[i]) {
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

    // 智能查找下一个图片的开始位置（跳过足够的字节以避免误判）
    ImageInfo findNextImageStart(const std::vector<unsigned char>& data, size_t afterPos, size_t minGap = 1000) {
        // 从afterPos + minGap开始搜索，避免在当前图片内部找到相同的签名
        size_t searchStart = afterPos + minGap;
        if (searchStart >= data.size()) {
            return {0, "UNKNOWN", ".bin", false};
        }
        
        return findImageSignature(data, searchStart);
    }

    // 读取魔法图片文件
    std::vector<unsigned char> readMagicImage(const std::string& filename) {
        std::ifstream file(filename, std::ios::binary);
        if (!file.is_open()) {
            throw std::runtime_error("无法打开文件: " + filename);
        }

        file.seekg(0, std::ios::end);
        size_t fileSize = file.tellg();
        file.seekg(0, std::ios::beg);

        if (fileSize == 0) {
            throw std::runtime_error("文件为空: " + filename);
        }

        std::vector<unsigned char> data(fileSize);
        file.read(reinterpret_cast<char*>(data.data()), fileSize);
        
        if (!file) {
            throw std::runtime_error("读取文件失败: " + filename);
        }

        return data;
    }

    // 提取并保存图片
    bool extractImage(const std::vector<unsigned char>& data, 
                     size_t startPos, 
                     size_t endPos, 
                     const std::string& outputPath) {
        if (startPos >= data.size() || endPos > data.size() || startPos >= endPos) {
            std::cerr << "错误: 无效的图片数据范围 (start: " << startPos << ", end: " << endPos << ", size: " << data.size() << ")" << std::endl;
            return false;
        }

        std::ofstream outputFile(outputPath, std::ios::binary);
        if (!outputFile.is_open()) {
            std::cerr << "错误: 无法创建输出文件: " << outputPath << std::endl;
            return false;
        }

        size_t imageSize = endPos - startPos;
        outputFile.write(reinterpret_cast<const char*>(data.data() + startPos), imageSize);
        
        if (!outputFile) {
            std::cerr << "错误: 写入文件失败" << std::endl;
            return false;
        }

        std::cout << "图片已提取到: " << outputPath << " (大小: " << imageSize << " 字节)" << std::endl;
        return true;
    }

    // 普通模式：显示第一张图片
    bool viewNormalMode(const std::string& inputPath, const std::string& outputPath = "") {
        try {
            std::cout << "=== 普通模式 ===" << std::endl;
            auto data = readMagicImage(inputPath);
            
            // 查找第一个图片签名
            auto firstImage = findImageSignature(data, 0);
            if (!firstImage.found) {
                std::cerr << "错误: 未找到有效的图片格式" << std::endl;
                return false;
            }

            std::cout << "找到第一张图片:" << std::endl;
            std::cout << "  格式: " << firstImage.format << std::endl;
            std::cout << "  起始位置: " << firstImage.position << std::endl;

            // 智能查找下一个图片的开始位置
            auto nextImage = findNextImageStart(data, firstImage.position, 1000);
            size_t firstImageEnd;
            
            if (nextImage.found) {
                firstImageEnd = nextImage.position;
                std::cout << "  下一张图片开始于: " << nextImage.position << std::endl;
            } else {
                firstImageEnd = data.size();
                std::cout << "  未找到下一张图片，使用文件结尾" << std::endl;
            }
            
            std::cout << "  结束位置: " << firstImageEnd << std::endl;
            std::cout << "  大小: " << (firstImageEnd - firstImage.position) << " 字节" << std::endl;

            if (!outputPath.empty()) {
                return extractImage(data, firstImage.position, firstImageEnd, outputPath);
            } else {
                std::string defaultOutput = "extracted_image_1" + firstImage.extension;
                return extractImage(data, firstImage.position, firstImageEnd, defaultOutput);
            }

        } catch (const std::exception& e) {
            std::cerr << "错误: " << e.what() << std::endl;
            return false;
        }
    }

    // 魔法模式：显示隐藏的第二张图片
    bool viewMagicMode(const std::string& inputPath, const std::string& outputPath = "") {
        try {
            std::cout << "=== 魔法模式 ===" << std::endl;
            auto data = readMagicImage(inputPath);
            
            // 查找第一个图片签名
            auto firstImage = findImageSignature(data, 0);
            if (!firstImage.found) {
                std::cerr << "错误: 未找到有效的图片格式" << std::endl;
                return false;
            }

            std::cout << "第一张图片信息:" << std::endl;
            std::cout << "  格式: " << firstImage.format << std::endl;
            std::cout << "  起始位置: " << firstImage.position << std::endl;

            // 智能查找第二张图片
            auto secondImage = findNextImageStart(data, firstImage.position, 1000);
            if (!secondImage.found) {
                std::cerr << "未找到隐藏的第二张图片" << std::endl;
                std::cout << "提示: 这可能不是一个魔法图片，或者第二张图片格式不受支持" << std::endl;
                return false;
            }

            size_t firstImageEnd = secondImage.position;
            std::cout << "  结束位置: " << firstImageEnd << std::endl;
            std::cout << "  大小: " << (firstImageEnd - firstImage.position) << " 字节" << std::endl;

            std::cout << "找到隐藏的第二张图片:" << std::endl;
            std::cout << "  格式: " << secondImage.format << std::endl;
            std::cout << "  起始位置: " << secondImage.position << std::endl;
            
            // 查找第三张图片或使用文件结尾
            auto thirdImage = findNextImageStart(data, secondImage.position, 1000);
            size_t secondImageEnd = thirdImage.found ? thirdImage.position : data.size();
            
            std::cout << "  结束位置: " << secondImageEnd << std::endl;
            std::cout << "  大小: " << (secondImageEnd - secondImage.position) << " 字节" << std::endl;

            if (!outputPath.empty()) {
                return extractImage(data, secondImage.position, secondImageEnd, outputPath);
            } else {
                std::string defaultOutput = "extracted_image_2" + secondImage.extension;
                return extractImage(data, secondImage.position, secondImageEnd, defaultOutput);
            }

        } catch (const std::exception& e) {
            std::cerr << "错误: " << e.what() << std::endl;
            return false;
        }
    }

    // 分析魔法图片结构
    void analyzeMagicImage(const std::string& inputPath) {
        try {
            std::cout << "=== 魔法图片分析 (最终修复版) ===" << std::endl;
            auto data = readMagicImage(inputPath);
            std::cout << "文件总大小: " << data.size() << " 字节" << std::endl;
            std::cout << std::endl;

            // 查找所有图片
            std::vector<ImageInfo> images;
            size_t searchPos = 0;
            int imageCount = 1;

            while (searchPos < data.size() && imageCount <= 10) {
                auto imageInfo = findImageSignature(data, searchPos);
                if (!imageInfo.found) {
                    break;
                }
                
                images.push_back(imageInfo);
                
                std::cout << "图片 " << imageCount << ":" << std::endl;
                std::cout << "  格式: " << imageInfo.format << std::endl;
                std::cout << "  起始位置: " << imageInfo.position << std::endl;
                
                // 查找下一张图片来确定当前图片的大小
                auto nextImage = findNextImageStart(data, imageInfo.position, 1000);
                size_t imageEnd = nextImage.found ? nextImage.position : data.size();
                
                std::cout << "  结束位置: " << imageEnd << std::endl;
                std::cout << "  大小: " << (imageEnd - imageInfo.position) << " 字节" << std::endl;
                std::cout << std::endl;
                
                searchPos = imageEnd;
                imageCount++;
            }

            if (images.size() == 0) {
                std::cout << "未找到任何有效的图片格式" << std::endl;
            } else if (images.size() == 1) {
                std::cout << "这是一个普通图片文件" << std::endl;
            } else {
                std::cout << "这是一个魔法图片，包含 " << images.size() << " 张图片" << std::endl;
            }

        } catch (const std::exception& e) {
            std::cerr << "错误: " << e.what() << std::endl;
        }
    }
};

void printUsage(const char* programName) {
    std::cout << "魔法图片查看器 v1.2" << std::endl;
    std::cout << "用法: " << programName << " [选项] <魔法图片文件> [输出文件]" << std::endl;
    std::cout << std::endl;
    std::cout << "选项:" << std::endl;
    std::cout << "  -n, --normal    普通模式 (显示第一张图片，默认)" << std::endl;
    std::cout << "  -m, --magic     魔法模式 (显示隐藏的第二张图片)" << std::endl;
    std::cout << "  -a, --analyze   分析模式 (分析魔法图片结构)" << std::endl;
    std::cout << "  -h, --help      显示帮助信息" << std::endl;
    std::cout << std::endl;
    std::cout << "参数:" << std::endl;
    std::cout << "  魔法图片文件    要查看的魔法图片文件路径" << std::endl;
    std::cout << "  输出文件        提取图片的保存路径 (可选)" << std::endl;
    std::cout << std::endl;
    std::cout << std::endl;
    std::cout << "示例:" << std::endl;
    std::cout << "  " << programName << " magic_image.jpg                    # 普通模式" << std::endl;
    std::cout << "  " << programName << " -m magic_image.jpg                 # 魔法模式" << std::endl;
    std::cout << "  " << programName << " -n magic_image.jpg first.jpg       # 提取第一张图片" << std::endl;
    std::cout << "  " << programName << " -m magic_image.jpg hidden.png      # 提取隐藏图片" << std::endl;
    std::cout << "  " << programName << " -a magic_image.jpg                 # 分析图片结构" << std::endl;
}

int main(int argc, char* argv[]) {
    if (argc < 2) {
        printUsage(argv[0]);
        return 1;
    }

    std::string mode = "normal";
    std::string inputPath;
    std::string outputPath;

    // 解析命令行参数
    for (int i = 1; i < argc; ++i) {
        std::string arg = argv[i];
        
        if (arg == "-h" || arg == "--help") {
            printUsage(argv[0]);
            return 0;
        } else if (arg == "-n" || arg == "--normal") {
            mode = "normal";
        } else if (arg == "-m" || arg == "--magic") {
            mode = "magic";
        } else if (arg == "-a" || arg == "--analyze") {
            mode = "analyze";
        } else if (inputPath.empty()) {
            inputPath = arg;
        } else if (outputPath.empty()) {
            outputPath = arg;
        } else {
            std::cerr << "错误: 参数过多" << std::endl;
            printUsage(argv[0]);
            return 1;
        }
    }

    if (inputPath.empty()) {
        std::cerr << "错误: 请指定魔法图片文件" << std::endl;
        printUsage(argv[0]);
        return 1;
    }

    MagicImageViewer viewer;
    bool success = false;

    std::cout << "输入文件: " << inputPath << std::endl;
    if (!outputPath.empty()) {
        std::cout << "输出文件: " << outputPath << std::endl;
    }
    std::cout << std::endl;

    if (mode == "normal") {
        success = viewer.viewNormalMode(inputPath, outputPath);
    } else if (mode == "magic") {
        success = viewer.viewMagicMode(inputPath, outputPath);
    } else if (mode == "analyze") {
        viewer.analyzeMagicImage(inputPath);
        success = true;
    }

    return success ? 0 : 1;
}