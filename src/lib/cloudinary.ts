interface CloudinaryUploadResponse {
  id: string;
  url: string;
  format: string;
  width: number;
  height: number;
  size: number;
  originalName: string;
}

interface UploadOptions {
  userId?: string | null;
}

// Upload an image and return the public URL
export async function uploadImageToCloudinary(
  file: File, 
  options: UploadOptions = {}
): Promise<CloudinaryUploadResponse> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    if (options.userId) {
      formData.append('userId', options.userId);
    }

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Upload failed: ${error.message || error.details || response.statusText}`);
    }

    const data: CloudinaryUploadResponse = await response.json();
    return data;
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