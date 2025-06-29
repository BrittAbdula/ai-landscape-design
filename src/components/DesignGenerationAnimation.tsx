"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { generateDesign } from "@/lib/api";
import {
  Sparkles,
  Wand2,
  Palette,
  Layers,
  CheckCircle2,
  Loader2
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

interface GeneratedDesign {
  imageUrl: string;
}

interface DesignGenerationAnimationProps {
  analysisResult: AnalysisResult;
  originalImageUrl: string;
  style: string;
  onGenerationComplete: (result: GeneratedDesign) => void;
  onError: (error: Error) => void;
  customPrompt?: string;
}

const generationSteps = [
  {
    id: 'style',
    title: 'Applying Design Style',
    description: 'Applying the selected AI landscape design style to your space...',
    icon: Wand2,
    duration: 2000,
  },
  {
    id: 'layout',
    title: 'Adjusting Layout Structure',
    description: 'Optimizing the layout for your outdoor space with AI garden design...',
    icon: Layers,
    duration: 2000,
  },
  {
    id: 'details',
    title: 'Enhancing Details',
    description: 'Refining design details using smart landscaping tools...',
    icon: Palette,
    duration: 2000,
  },
  {
    id: 'final',
    title: 'Final Rendering',
    description: 'Generating the final result with the best AI landscape design generator...',
    icon: CheckCircle2,
    duration: 2000,
  },
];

export default function DesignGenerationAnimation({
  analysisResult,
  originalImageUrl,
  style,
  onGenerationComplete,
  onError,
  customPrompt
}: DesignGenerationAnimationProps) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Generating your AI Landscape Design...');
  const [currentStep, setCurrentStep] = useState(0);
  const [stepProgress, setStepProgress] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [isStepAnimating, setIsStepAnimating] = useState(true);

  // 步骤动画自动切换逻辑
  useEffect(() => {
    if (!isStepAnimating) return;
    if (currentStep >= generationSteps.length - 1) return; // 最后一步停住

    setStepProgress(0);
    const stepDuration = generationSteps[currentStep].duration;
    let progressInterval: NodeJS.Timeout;
    const start = Date.now();

    // 步骤进度条动画
    progressInterval = setInterval(() => {
      const elapsed = Date.now() - start;
      const percent = Math.min((elapsed / stepDuration) * 100, 100);
      setStepProgress(percent);
      if (percent >= 100) {
        clearInterval(progressInterval);
        setCompletedSteps(prev => [...prev, generationSteps[currentStep].id]);
        setCurrentStep(prev => prev + 1);
      }
    }, 50);

    return () => {
      clearInterval(progressInterval);
    };
  }, [currentStep, isStepAnimating]);

  // 生成接口响应后，补全最后一步动画
  useEffect(() => {
    if (currentStep === generationSteps.length - 1) {
      setStepProgress(100);
      setCompletedSteps(prev => {
        if (!prev.includes(generationSteps[currentStep].id)) {
          return [...prev, generationSteps[currentStep].id];
        }
        return prev;
      });
    }
  }, [currentStep]);

  useEffect(() => {
    let mounted = true;
    const startTime = Date.now();
    const minDuration = 5000; // 最短动画时间
    const maxDuration = 15000; // 最长等待时间

    // 进度条动画
    const animateProgress = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / minDuration) * 100, 95);
      
      if (mounted && elapsed < maxDuration) {
        setProgress(newProgress);
        requestAnimationFrame(animateProgress);
      }
    };

    // 开始生成
    const generate = async () => {
      try {
        let result;
        if (style === 'custom' && customPrompt) {
          result = await generateDesign(analysisResult, style, customPrompt, originalImageUrl);
        } else {
          result = await generateDesign(analysisResult, style, undefined, originalImageUrl);
        }
        if (mounted) {
          // 确保至少显示最短动画时间
          const elapsed = Date.now() - startTime;
          if (elapsed < minDuration) {
            await new Promise(resolve => setTimeout(resolve, minDuration - elapsed));
          }
          setProgress(100);
          setStatus('Generation Complete! Transform your outdoor space with AI.');
          setIsStepAnimating(false); // 停止步骤动画
          setCurrentStep(generationSteps.length - 1); // 保证停在最后一步
          setStepProgress(100);
          setCompletedSteps(generationSteps.map(step => step.id)); // 全部标记为完成
          onGenerationComplete(result);
        }
      } catch (error) {
        if (mounted) {
          setStatus('Generation Failed. Please try again with our free AI landscape design tool.');
          setIsStepAnimating(false);
          setCurrentStep(generationSteps.length - 1);
          setStepProgress(100);
          onError(error as Error);
        }
      }
    };

    animateProgress();
    generate();

    return () => {
      mounted = false;
    };
  }, [analysisResult, style, onGenerationComplete, onError, customPrompt, originalImageUrl]);

  return (
    <div className="w-full max-w-xl mx-auto p-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">
          AI Landscape Design in Progress
          <Loader2 className="inline-block ml-2 w-6 h-6 animate-spin" />
        </h2>
        <p className="text-gray-600 font-body">
          Creating the perfect landscape for your space with {style} style using the best AI landscape design tools online...
        </p>
      </div>

      {/* Original Image Preview */}
      <Card className="mb-6 overflow-hidden">
        <CardContent className="p-0">
          <div className="relative">
            <img
              src={originalImageUrl}
              alt="Original Space"
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

      {/* Progress Bar */}
      <div className="mb-6">
        <Progress value={progress} className="h-2" />
        <div className="mt-2 text-center text-sm text-gray-600">
          {Math.round(progress)}% Complete
        </div>
      </div>

      {/* Generation Steps */}
      <div className="space-y-4">
        {generationSteps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = currentStep === index;
          const Icon = step.icon;

          return (
            <div key={step.id} className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <Icon className={`w-6 h-6 ${isCompleted ? 'text-green-500' : isCurrent ? 'text-blue-500' : 'text-gray-300'}`} />
              </div>
              <div className="flex-grow">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium">{step.title}</h3>
                  <Badge variant={isCompleted ? "outline" : isCurrent ? "default" : "secondary"}>
                    {isCompleted ? 'Completed' : isCurrent ? 'In Progress' : 'Pending'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{step.description}</p>
                {isCurrent && (
                  <Progress value={stepProgress} className="mt-2 h-1" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 