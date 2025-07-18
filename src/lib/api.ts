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

interface UploadResponse {
  id: string;
  url: string;
  format: string;
  width: number;
  height: number;
  size: number;
  originalName: string;
}

// Upload image to Cloudinary
export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.details || 'Upload failed');
  }

  const data = await response.json() as UploadResponse;
  return data.url;
}

// Analyze image
export async function analyzeImage(imageUrl: string): Promise<AnalysisResult> {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ imageUrl }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.details || 'Analysis failed');
  }

  return response.json();
}

// Generate design
export async function generateDesign(
  analysisResult: AnalysisResult,
  style: string,
  customPrompt: string | undefined,
  imageUrl: string
): Promise<GeneratedDesign> {
  type BodyType = { customPrompt: string; imageUrl: string } | { analysisResult: AnalysisResult; style: string; imageUrl: string };
  let body: BodyType;
  if (customPrompt) {
    body = { customPrompt, imageUrl };
  } else {
    body = { analysisResult, style, imageUrl };
  }
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.details || 'Generation failed');
  }

  const data = await response.json();

  // Extract image URL from markdown in data.result
  let imageUrlResult = '';
  if (data.result) {
    const match = data.result.match(/!\[.*?\]\((.*?)\)/);
    if (match && match[1]) {
      imageUrlResult = match[1];
    }
  }

  return { imageUrl: imageUrlResult };
} 