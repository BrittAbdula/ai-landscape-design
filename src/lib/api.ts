interface AnalysisResult {
  spaceType: string;
  size: string;
  existingFeatures: string[];
  lighting: string;
  soilType: string;
  climate: string;
  challenges: string[];
  opportunities: string[];
  recommendations: string[];
}

interface GeneratedDesign {
  imageUrl: string;
}

// 上传图片到Cloudinary
export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Upload failed');
  }

  const data = await response.json();
  return data.secure_url;
}

// 分析图片
export async function analyzeImage(imageUrl: string): Promise<AnalysisResult> {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ imageUrl }),
  });

  if (!response.ok) {
    throw new Error('Analysis failed');
  }

  return response.json();
}

// 生成设计
export async function generateDesign(imageUrl: string, style: string, customDescription?: string): Promise<GeneratedDesign> {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      imageUrl,
      style,
      customDescription,
    }),
  });

  if (!response.ok) {
    throw new Error('Generation failed');
  }

  return response.json();
} 