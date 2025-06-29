import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

// Cloudinary types
declare module 'cloudinary' {
    interface UploadApiResponse {
        secure_url: string;
        public_id: string;
        format: string;
        width: number;
        height: number;
        bytes: number;
        original_filename: string;
        [key: string]: any;
    }

    interface UploadApiOptions {
        folder?: string;
        resource_type?: string;
        upload_preset?: string;
    }

    interface Uploader {
        upload_stream(
            options: UploadApiOptions,
            callback: (error: Error | undefined | null, result: UploadApiResponse) => void
        ): NodeJS.WritableStream;
    }

    interface V2 {
        uploader: Uploader;
        config(options: {
            cloud_name: string | undefined;
            api_key: string | undefined;
            api_secret: string | undefined;
            secure: boolean;
        }): void;
    }
}

interface CloudinaryUploadResult {
    secure_url: string;
    public_id: string;
    format: string;
    width: number;
    height: number;
    bytes: number;
    original_filename: string;
    [key: string]: any; // This is acceptable here as it's for the external API response
}

interface ImageUploadResponse {
    id: string;
    url: string;
    width?: number;
    height?: number;
    format?: string;
}

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const userId = formData.get('userId') as string | null;

        if (!file) {
            return NextResponse.json(
                { 
                    success: false,
                    errors: [{ message: 'No file provided', code: 400 }]
                },
                { status: 400 }
            );
        }

        // Convert File object to Buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Cloudinary
        const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'ai-landscape-design',
                    resource_type: 'auto',
                    upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
                },
                (error: Error | undefined | null, result: CloudinaryUploadResult) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );

            // Write buffer to stream
            const readableStream = new Readable();
            readableStream.push(buffer);
            readableStream.push(null);
            readableStream.pipe(uploadStream);
        });

        // Format the response to match the expected structure
        const response: ImageUploadResponse = {
            id: result.public_id,
            url: result.secure_url,
            width: result.width,
            height: result.height,
            format: result.format
        };

        // Note: Database integration would go here if needed
        // For now, we'll just return the upload result
        
        return NextResponse.json({
            success: true,
            result: response
        });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { 
                success: false,
                errors: [{ 
                    message: error instanceof Error ? error.message : 'Upload failed',
                    code: 500 
                }]
            },
            { status: 500 }
        );
    }
} 