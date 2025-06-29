"use client";

import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

interface FileUploadProps {
  onFileUpload: (file: File, cloudinaryUrl?: string) => void;
  onAnalysisStart: () => void;
}

export default function FileUpload({ onFileUpload, onAnalysisStart }: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [cloudinaryUrl, setCloudinaryUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelection = useCallback(async (file: File) => {
    setUploadedFile(file);
    setUploadError(null);
    setIsUploading(true);

    // Create image preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    try {
      // Upload to Cloudinary
      const uploadResult = await uploadImageToCloudinary(file);
      setCloudinaryUrl(uploadResult.url);
      console.log('Image uploaded to Cloudinary:', uploadResult.url);
      
      // Call the parent component's onFileUpload with the file and Cloudinary URL
      onFileUpload(file, uploadResult.url);

      // Automatically start analysis after successful upload
      onAnalysisStart();
      
    } catch (error) {
      console.error('Failed to upload to Cloudinary:', error);
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
      
      // Even if Cloudinary upload fails, still notify parent component (using local file)
      onFileUpload(file);
    } finally {
      setIsUploading(false);
    }
  }, [onFileUpload, onAnalysisStart]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));

    if (imageFile) {
      handleFileSelection(imageFile);
    }
  }, [handleFileSelection]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file?.type.startsWith('image/')) {
      handleFileSelection(file);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setImagePreview(null);
    setCloudinaryUrl(null);
    setUploadError(null);
    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleStartAnalysis = () => {
    if (uploadedFile) {
      onAnalysisStart();
    }
  };

  return (
    <div className="space-y-6">
      {!uploadedFile ? (
        <Card
          className={`border-2 border-dashed transition-all duration-300 cursor-pointer hover-lift ${
            isDragOver
              ? 'border-green-500 bg-green-50 scale-105'
              : 'border-gray-300 hover:border-green-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300 ${
              isDragOver ? 'bg-green-600 scale-110' : 'bg-green-100'
            }`}>
              <Upload className={`w-8 h-8 transition-colors duration-300 ${
                isDragOver ? 'text-white' : 'text-green-600'
              }`} />
            </div>
            <h3 className="text-xl font-heading font-semibold text-gray-900 mb-2">
              {isDragOver ? 'Drop your image here!' : 'Upload Your Yard Photo'}
            </h3>
            <p className="text-gray-600 font-body mb-4 max-w-md">
              Drag and drop your yard photo here, or click to browse.
              We accept JPG, PNG, and WebP files up to 10MB.
            </p>
            <Button
              variant="outline"
              className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Choose File
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileInputChange}
            />
          </CardContent>
        </Card>
      ) : (
        <Card className="overflow-hidden hover-scale transition-transform duration-300">
          <CardContent className="p-0">
            <div className="relative">
              {imagePreview && (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Uploaded yard"
                    className="w-full h-64 object-cover"
                  />
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="flex items-center text-white">
                        <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                        <span>Uploading to cloud...</span>
                      </div>
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white"
                    onClick={handleRemoveFile}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
              <div className="p-6">
                <h3 className="font-heading font-semibold text-lg mb-2">
                  {isUploading ? 'Uploading...' : 'Perfect! Your photo is ready'}
                </h3>
                <p className="text-gray-600 font-body mb-2">
                  File: {uploadedFile.name} ({Math.round(uploadedFile.size / 1024)} KB)
                </p>
              
                {cloudinaryUrl && !isUploading && (
                  <div className="flex items-center text-green-600 mb-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                    <span className="text-sm">Successfully uploaded to cloud</span>
                  </div>
                )}
              
                {uploadError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                    <p className="text-red-600 text-sm">
                      <strong>Upload failed:</strong> {uploadError}
                    </p>
                    <p className="text-red-500 text-xs mt-1">
                      Will proceed with local file
                    </p>
                  </div>
                )}
              
                <Button
                  className="w-full"
                  onClick={handleStartAnalysis}
                  disabled={isUploading}
                >
                  Start Analysis
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
