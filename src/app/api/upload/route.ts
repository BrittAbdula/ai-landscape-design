import { NextResponse } from 'next/server';

interface CloudinaryUploadResult {
    secure_url: string;
    public_id: string;
    format: string;
    width: number;
    height: number;
    bytes: number;
    original_filename: string;
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const userId = formData.get('userId') as string | null;

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        // Create a new FormData for Cloudinary
        const cloudinaryFormData = new FormData();
        cloudinaryFormData.append('file', file);
        cloudinaryFormData.append('upload_preset', process.env.CLOUDINARY_UPLOAD_PRESET || '');
        
        // Add folder based on userId
        if (userId) {
            cloudinaryFormData.append('folder', `user_${userId}`);
        } else {
            cloudinaryFormData.append('folder', 'anonymous');
        }

        // Add timestamp and signature for signed uploads
        if (process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
            const timestamp = Math.round(new Date().getTime() / 1000);
            cloudinaryFormData.append('timestamp', timestamp.toString());
            cloudinaryFormData.append('api_key', process.env.CLOUDINARY_API_KEY);
        }

        // Upload to Cloudinary via REST API
        const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
            method: 'POST',
            body: cloudinaryFormData
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Cloudinary upload error:', error);
            return NextResponse.json(
                { error: 'Upload failed', details: error.error?.message || 'Unknown error' },
                { status: response.status }
            );
        }

        const result = await response.json() as CloudinaryUploadResult;

        // Return successful response
        return NextResponse.json({
            id: result.public_id,
            url: result.secure_url,
            format: result.format,
            width: result.width,
            height: result.height,
            size: result.bytes,
            originalName: result.original_filename
        });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Upload failed', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
} 