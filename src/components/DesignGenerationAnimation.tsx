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
}

const generationSteps = [
  {
    id: 'style',
    title: '应用设计风格',
    description: '正在应用选定的设计风格...',
    icon: Wand2,
    duration: 2000,
  },
  {
    id: 'layout',
    title: '调整布局结构',
    description: '正在优化空间布局...',
    icon: Layers,
    duration: 2000,
  },
  {
    id: 'details',
    title: '优化细节',
    description: '正在完善设计细节...',
    icon: Palette,
    duration: 2000,
  },
  {
    id: 'final',
    title: '最终渲染',
    description: '正在生成最终效果图...',
    icon: CheckCircle2,
    duration: 2000,
  },
];

export default function DesignGenerationAnimation({
  analysisResult,
  originalImageUrl,
  style,
  onGenerationComplete,
  onError
}: DesignGenerationAnimationProps) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('正在生成设计...');
  const [currentStep, setCurrentStep] = useState(0);
  const [stepProgress, setStepProgress] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

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
        const result = await generateDesign(analysisResult, style);
        
        if (mounted) {
          // 确保至少显示最短动画时间
          const elapsed = Date.now() - startTime;
          if (elapsed < minDuration) {
            await new Promise(resolve => setTimeout(resolve, minDuration - elapsed));
          }
          
          setProgress(100);
          setStatus('生成完成！');
          onGenerationComplete(result);
        }
      } catch (error) {
        if (mounted) {
          setStatus('生成失败');
          onError(error as Error);
        }
      }
    };

    animateProgress();
    generate();

    return () => {
      mounted = false;
    };
  }, [analysisResult, style, onGenerationComplete, onError]);

  return (
    <div className="w-full max-w-xl mx-auto p-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">
          AI设计生成中
          <Loader2 className="inline-block ml-2 w-6 h-6 animate-spin" />
        </h2>
        <p className="text-gray-600 font-body">
          基于{style}风格，为您的空间创造完美的景观设计...
        </p>
      </div>

      {/* Original Image Preview */}
      <Card className="mb-6 overflow-hidden">
        <CardContent className="p-0">
          <div className="relative">
            <img
              src={originalImageUrl}
              alt="原始空间"
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
          {Math.round(progress)}% 完成
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
                    {isCompleted ? '完成' : isCurrent ? '进行中' : '等待中'}
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