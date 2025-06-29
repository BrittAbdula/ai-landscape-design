"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Download } from "lucide-react";
import BeforeAfterSlider from "./BeforeAfterSlider";

interface AIResultsProps {
  uploadedImage: string;
  generatedImage: string;
  onStartNew: () => void;
}

export default function AIResults({ uploadedImage, generatedImage, onStartNew }: AIResultsProps) {
  const handleDownload = async () => {
    try {
      // Fetch the image
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      
      // Set filename - extract from URL or use default
      const filename = generatedImage.split('/').pop() || 'generated-landscape-design.jpg';
      link.download = filename;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download image. Please try again.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 mb-4">
          Your AI-Generated Design Is Ready!
        </h2>
        <p className="text-lg font-body text-gray-600 max-w-2xl mx-auto">
          Compare your original space with the AI-generated design using the interactive slider.
        </p>
      </div>

      {/* Main Before/After Comparison */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <BeforeAfterSlider
            beforeImage={uploadedImage}
            afterImage={generatedImage}
            showDemo={false}
          />
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Button
          variant="outline"
          onClick={onStartNew}
          className="border-gray-300 text-gray-600 hover:bg-gray-50 hover-lift"
        >
          <ArrowRight className="w-4 h-4 mr-2" />
          Start New Design
        </Button>

        <Button
          variant="outline"
          onClick={handleDownload}
          className="border-blue-200 text-blue-600 hover:bg-blue-50 hover-lift"
        >
          <Download className="w-4 h-4 mr-2" />
          Download HD
        </Button>
      </div>
    </div>
  );
}
