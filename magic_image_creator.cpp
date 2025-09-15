#include <iostream>
#include <fstream>
#include <vector>
#include <string>
#include <cstring>

class MagicImageCreator {
private:
    // 图片格式魔数标记
    struct ImageSignature {
        std::vector<unsigned char> signature;
        std::string format;
    };
    
    std::vector<ImageSignature> knownSignatures = {
        {{0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A}, "PNG"},
        {{0xFF, 0xD8, 0xFF}, "JPEG"},
        {{0x47, 0x49, 0x46, 0x38}, "GIF"},
        {{0x42, 0x4D}, "BMP"}
    };

public:
    // 检测图片格式
    std::string detectImageFormat(const std::vector<unsigned char>& data) {
        for (const auto& sig : knownSignatures) {
            if (data.size() >= sig.signature.size()) {
                bool match = true;
                for (size_t i = 0; i < sig.signature.size(); ++i) {
                    if (data[i] != sig.signature[i]) {
                        match = false;
                        break;
                    }
                }
                if (match) {
                    return sig.format;
                }
            }
        }
        return "UNKNOWN";
    }

    // 读取图片文件
    std::vector<unsigned char> readImageFile(const std::string& filename) {
        std::ifstream file(filename, std::ios::binary);
        if (!file.is_open()) {
            throw std::runtime_error("无法打开文件: " + filename);
        }

        // 获取文件大小
        file.seekg(0, std::ios::end);
        size_t fileSize = file.tellg();
        file.seekg(0, std::ios::beg);

        if (fileSize == 0) {
            throw std::runtime_error("文件为空: " + filename);
        }

        // 读取文件数据
        std::vector<unsigned char> data(fileSize);
        file.read(reinterpret_cast<char*>(data.data()), fileSize);
        
        if (!file) {
            throw std::runtime_error("读取文件失败: " + filename);
        }

        return data;
    }

    // 创建魔法图片
    bool createMagicImage(const std::string& image1Path, 
                         const std::string& image2Path, 
                         const std::string& outputPath) {
        try {
            std::cout << "正在读取第一张图片: " << image1Path << std::endl;
            auto image1Data = readImageFile(image1Path);
            std::string format1 = detectImageFormat(image1Data);
            std::cout << "检测到格式: " << format1 << " (大小: " << image1Data.size() << " 字节)" << std::endl;

            std::cout << "正在读取第二张图片: " << image2Path << std::endl;
            auto image2Data = readImageFile(image2Path);
            std::string format2 = detectImageFormat(image2Data);
            std::cout << "检测到格式: " << format2 << " (大小: " << image2Data.size() << " 字节)" << std::endl;

            if (format1 == "UNKNOWN" || format2 == "UNKNOWN") {
                std::cerr << "警告: 检测到未知图片格式，但仍将继续处理" << std::endl;
            }

            // 创建输出文件
            std::ofstream outputFile(outputPath, std::ios::binary);
            if (!outputFile.is_open()) {
                throw std::runtime_error("无法创建输出文件: " + outputPath);
            }

            // 写入第一张图片的完整数据
            outputFile.write(reinterpret_cast<const char*>(image1Data.data()), image1Data.size());
            
            // 直接拼接第二张图片的完整数据
            outputFile.write(reinterpret_cast<const char*>(image2Data.data()), image2Data.size());

            if (!outputFile) {
                throw std::runtime_error("写入输出文件失败");
            }

            std::cout << "魔法图片创建成功!" << std::endl;
            std::cout << "输出文件: " << outputPath << std::endl;
            std::cout << "总大小: " << (image1Data.size() + image2Data.size()) << " 字节" << std::endl;
            std::cout << "第一张图片: 0 - " << (image1Data.size() - 1) << " 字节" << std::endl;
            std::cout << "第二张图片: " << image1Data.size() << " - " << (image1Data.size() + image2Data.size() - 1) << " 字节" << std::endl;

            return true;

        } catch (const std::exception& e) {
            std::cerr << "错误: " << e.what() << std::endl;
            return false;
        }
    }
};

void printUsage(const char* programName) {
    std::cout << "魔法图片生成器 v1.0" << std::endl;
    std::cout << "用法: " << programName << " <第一张图片> <第二张图片> <输出文件>" << std::endl;
    std::cout << std::endl;
    std::cout << "参数说明:" << std::endl;
    std::cout << "  第一张图片  - 主图片文件路径 (支持 PNG, JPEG, GIF, BMP)" << std::endl;
    std::cout << "  第二张图片  - 隐藏图片文件路径 (支持 PNG, JPEG, GIF, BMP)" << std::endl;
    std::cout << "  输出文件    - 生成的魔法图片文件路径" << std::endl;
    std::cout << std::endl;
    std::cout << "示例:" << std::endl;
    std::cout << "  " << programName << " photo1.jpg photo2.png magic_image.jpg" << std::endl;
}

int main(int argc, char* argv[]) {
    if (argc != 4) {
        printUsage(argv[0]);
        return 1;
    }

    std::string image1Path = argv[1];
    std::string image2Path = argv[2];
    std::string outputPath = argv[3];

    MagicImageCreator creator;
    
    std::cout << "=== 魔法图片生成器 ===" << std::endl;
    std::cout << "第一张图片: " << image1Path << std::endl;
    std::cout << "第二张图片: " << image2Path << std::endl;
    std::cout << "输出文件: " << outputPath << std::endl;
    std::cout << std::endl;

    bool success = creator.createMagicImage(image1Path, image2Path, outputPath);
    
    if (success) {
        std::cout << std::endl;
        std::cout << "提示: 生成的魔法图片在普通查看器中将显示第一张图片" << std::endl;
        std::cout << "      使用魔法图片查看器可以查看隐藏的第二张图片" << std::endl;
        return 0;
    } else {
        return 1;
    }
}