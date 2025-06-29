import { uploadImage, analyzeImage, generateDesign } from './api';

// 测试图片上传
export async function testImageUpload(file: File) {
  try {
    const imageUrl = await uploadImage(file);
    console.log('图片上传成功:', imageUrl);
    return true;
  } catch (error) {
    console.error('图片上传失败:', error);
    return false;
  }
}

// 测试图片分析
export async function testImageAnalysis(imageUrl: string) {
  try {
    const result = await analyzeImage(imageUrl);
    console.log('图片分析成功:', result);
    return true;
  } catch (error) {
    console.error('图片分析失败:', error);
    return false;
  }
}

// 测试设计生成
export async function testDesignGeneration(imageUrl: string, style: string) {
  try {
    const result = await generateDesign(imageUrl, style);
    console.log('设计生成成功:', result);
    return true;
  } catch (error) {
    console.error('设计生成失败:', error);
    return false;
  }
}

// 运行所有测试
export async function runAllTests(file: File) {
  console.log('开始运行API测试...');

  // 测试图片上传
  console.log('\n1. 测试图片上传');
  const uploadSuccess = await testImageUpload(file);
  
  if (!uploadSuccess) {
    console.error('图片上传测试失败，终止后续测试');
    return false;
  }

  // 获取上传后的图片URL
  const imageUrl = await uploadImage(file);

  // 测试图片分析
  console.log('\n2. 测试图片分析');
  const analysisSuccess = await testImageAnalysis(imageUrl);

  if (!analysisSuccess) {
    console.error('图片分析测试失败，终止后续测试');
    return false;
  }

  // 测试设计生成
  console.log('\n3. 测试设计生成');
  const generationSuccess = await testDesignGeneration(imageUrl, '现代简约');

  if (!generationSuccess) {
    console.error('设计生成测试失败');
    return false;
  }

  console.log('\n所有测试完成！');
  return true;
}

// 验证base64数据格式
export function validateBase64Image(base64String: string): {
  isValid: boolean;
  format?: string;
  error?: string;
} {
  try {
    // 检查是否是有效的data URL
    if (!base64String.startsWith('data:image/')) {
      return {
        isValid: false,
        error: '不是有效的图片数据URL格式'
      };
    }
    
    // 提取格式信息
    const formatMatch = base64String.match(/data:image\/([^;]+);base64,/);
    if (!formatMatch) {
      return {
        isValid: false,
        error: '无法识别图片格式'
      };
    }
    
    const format = formatMatch[1];
    const base64Data = base64String.split(',')[1];
    
    // 验证base64编码
    try {
      atob(base64Data);
    } catch {
      return {
        isValid: false,
        error: 'base64编码格式不正确'
      };
    }
    
    return {
      isValid: true,
      format
    };
    
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : '验证失败'
    };
  }
} 