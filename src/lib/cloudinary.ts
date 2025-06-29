interface CloudinaryUploadResponse {
  id: string;
  url: string;
  width?: number;
  height?: number;
  format?: string;
}

interface ApiResponse<T> {
  success: boolean;
  result?: T;
  errors?: Array<{
    message: string;
    code: number;
  }>;
}

// Upload image and return public URL
export async function uploadImageToCloudinary(file: File, userId?: string): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    if (userId) {
      formData.append('userId', userId);
    }

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data: ApiResponse<CloudinaryUploadResponse> = await response.json();

    if (!data.success || !data.result) {
      const errorMessage = data.errors?.[0]?.message || 'Upload failed';
      throw new Error(errorMessage);
    }

    return data.result.url;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}

// Helper function to extract public_id from Cloudinary URL
export function extractPublicIdFromUrl(url: string): string | null {
  try {
    // Cloudinary URL format: https://res.cloudinary.com/{cloud_name}/image/upload/{transformations}/{public_id}.{format}
    const match = url.match(/\/upload\/(?:v\d+\/)?(?:[^\/]+\/)*([^\/\.]+)/);
    return match ? match[1] : null;
  } catch (error) {
    console.error('Error extracting public_id from URL:', error);
    return null;
  }
} 