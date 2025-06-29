"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { analyzeImage } from "@/lib/api";
import {
  Scan,
  Brain,
  Palette,
  Sparkles,
  Eye,
  TreePine,
  Sun,
  Droplets,
  CheckCircle
} from "lucide-react";

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

interface AILoadingAnimationProps {
  imageUrl: string;
  onAnalysisComplete: (result: AnalysisResult) => void;
  onError: (error: Error) => void;
}

interface AnalysisStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  duration: number;
}

const analysisSteps: AnalysisStep[] = [
  {
    id: 'scan',
    title: 'Scanning Your Space',
    description: 'Analyzing image composition and identifying key elements...',
    icon: <Scan className="w-5 h-5" />,
    duration: 2000
  },
  {
    id: 'features',
    title: 'Identifying Features',
    description: 'Detecting existing structures, plants, and landscape elements...',
    icon: <Eye className="w-5 h-5" />,
    duration: 2500
  },
  {
    id: 'environment',
    title: 'Analyzing Environment',
    description: 'Assessing lighting conditions, space dimensions, and soil type...',
    icon: <Sun className="w-5 h-5" />,
    duration: 2000
  },
  {
    id: 'ai_processing',
    title: 'AI Processing',
    description: 'Running advanced algorithms to generate design possibilities...',
    icon: <Brain className="w-5 h-5" />,
    duration: 3000
  },
  {
    id: 'plant_selection',
    title: 'Plant Recommendations',
    description: 'Selecting optimal plants based on climate and conditions...',
    icon: <TreePine className="w-5 h-5" />,
    duration: 2000
  },
  {
    id: 'design_generation',
    title: 'Generating Designs',
    description: 'Creating multiple professional landscape design variations...',
    icon: <Palette className="w-5 h-5" />,
    duration: 2500
  }
];

export default function AILoadingAnimation({
  imageUrl,
  onAnalysisComplete,
  onError
}: AILoadingAnimationProps) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('正在分析图片...');
  const [currentStep, setCurrentStep] = useState(0);
  const [stepProgress, setStepProgress] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  useEffect(() => {
    let mounted = true;
    const startTime = Date.now();
    const minDuration = 3000; // Minimum animation duration
    const maxDuration = 10000; // Maximum wait time

    // Progress bar animation
    const animateProgress = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / minDuration) * 100, 95);
      
      if (mounted && elapsed < maxDuration) {
        setProgress(newProgress);
        requestAnimationFrame(animateProgress);
      }
    };

    // Start analysis
    const analyze = async () => {
      try {
        console.log('Starting analysis with image URL:', imageUrl);
        if (!imageUrl) {
          throw new Error('No image URL provided');
        }

        const result = await analyzeImage(imageUrl);
        console.log('Analysis result:', result);
        
        if (mounted) {
          // Ensure minimum animation duration
          const elapsed = Date.now() - startTime;
          if (elapsed < minDuration) {
            await new Promise(resolve => setTimeout(resolve, minDuration - elapsed));
          }
          
          setProgress(100);
          setStatus('Analysis complete!');
          onAnalysisComplete(result);
        }
      } catch (error) {
        console.error('Analysis error:', error);
        if (mounted) {
          setStatus('Analysis failed');
          onError(error as Error);
        }
      }
    };

    animateProgress();
    analyze();

    return () => {
      mounted = false;
    };
  }, [imageUrl, onAnalysisComplete, onError]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse shadow-lg border border-green-500/20">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-heading font-bold text-gray-900 mb-2">
          AI Analyzing Your Space
        </h2>
        <p className="text-gray-600 font-body">
          Our advanced AI is creating personalized landscape designs for you...
        </p>
      </div>

      {/* Uploaded Image Preview */}
      {imageUrl && (
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="relative">
              <img
                src={imageUrl}
                alt="Your uploaded space"
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
                <div className="p-4 text-white">
                  <p className="font-body text-sm">{status}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Overall Progress */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-2">
            <span className="font-heading font-medium text-gray-900">Overall Progress</span>
            <span className="font-body text-sm text-gray-600">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-3" />
        </CardContent>
      </Card>

      {/* Analysis Steps */}
      <div className="space-y-3">
        {analysisSteps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = index === currentStep;
          const isPending = index > currentStep;

          return (
            <Card
              key={step.id}
              className={`transition-all duration-500 ${
                isCurrent ? 'border-green-500 shadow-lg scale-105' :
                isCompleted ? 'border-green-200 bg-green-50' :
                'border-gray-200'
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    isCompleted ? 'bg-gradient-to-br from-green-600 to-blue-600 text-white shadow-md border border-green-500/20' :
                    isCurrent ? 'bg-gradient-to-br from-green-100 to-blue-100 text-green-600 animate-pulse border border-green-200/50' :
                    'bg-gray-100 text-gray-400'
                  }`}>
                    {isCompleted ? <CheckCircle className="w-5 h-5" /> : step.icon}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`font-heading font-medium ${
                        isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {step.title}
                      </h3>
                      {isCurrent && (
                        <Badge className="bg-green-600 text-white animate-pulse">
                          Processing...
                        </Badge>
                      )}
                      {isCompleted && (
                        <Badge className="bg-green-100 text-green-800">
                          Complete
                        </Badge>
                      )}
                    </div>

                    <p className={`font-body text-sm ${
                      isCompleted || isCurrent ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {step.description}
                    </p>

                    {isCurrent && (
                      <div className="mt-2">
                        <Progress value={stepProgress} className="h-2" />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Completion Message */}
      {currentStep >= analysisSteps.length && (
        <Card className="border-2 border-gradient-to-r from-green-500 to-blue-500 bg-gradient-to-br from-green-50 to-blue-50">
          <CardContent className="p-6 text-center">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <h3 className="font-heading font-semibold text-green-900 mb-2">
              Analysis Complete!
            </h3>
            <p className="font-body text-green-700">
              Your personalized landscape designs are ready. Preparing results...
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
