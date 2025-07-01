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
    duration: 1000
  },
  {
    id: 'features',
    title: 'Identifying Features',
    description: 'Detecting existing structures, plants, and landscape elements...',
    icon: <Eye className="w-5 h-5" />,
    duration: 1000
  },
  {
    id: 'environment',
    title: 'Analyzing Environment',
    description: 'Assessing lighting conditions, space dimensions, and soil type...',
    icon: <Sun className="w-5 h-5" />,
    duration: 1000
  },
  {
    id: 'ai_processing',
    title: 'AI Processing',
    description: 'Running advanced algorithms to generate design possibilities...',
    icon: <Brain className="w-5 h-5" />,
    duration: 1000
  },
  {
    id: 'plant_selection',
    title: 'Plant Recommendations',
    description: 'Selecting optimal plants based on climate and conditions...',
    icon: <TreePine className="w-5 h-5" />,
    duration: 1000
  },
  {
    id: 'design_generation',
    title: 'Generating Designs',
    description: 'Creating multiple professional landscape design variations...',
    icon: <Palette className="w-5 h-5" />,
    duration: 0 // 最后一个步骤等待API返回
  }
];

export default function AILoadingAnimation({
  imageUrl,
  onAnalysisComplete,
  onError
}: AILoadingAnimationProps) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Analyzing your space...');
  const [currentStep, setCurrentStep] = useState(0);
  const [stepProgress, setStepProgress] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [isApiProcessing, setIsApiProcessing] = useState(false);

  useEffect(() => {
    let mounted = true;

    const runStepSequence = async () => {
      // 执行前面的步骤（每个1秒）
      for (let i = 0; i < analysisSteps.length - 1; i++) {
        if (!mounted) return;
        
        setCurrentStep(i);
        setStepProgress(0);
        
        // 步骤进度条动画（1秒内从0到100）
        const stepStartTime = Date.now();
        const animateStepProgress = () => {
          if (!mounted) return;
          
          const elapsed = Date.now() - stepStartTime;
          const progress = Math.min((elapsed / 1000) * 100, 100);
          setStepProgress(progress);
          
          if (progress < 100) {
            requestAnimationFrame(animateStepProgress);
          }
        };
        
        animateStepProgress();
        
        // 等待1秒
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (mounted) {
          setCompletedSteps(prev => [...prev, analysisSteps[i].id]);
          setStepProgress(100);
        }
      }
      
      // 开始最后一个步骤（等待API）
      if (mounted) {
        setCurrentStep(analysisSteps.length - 1);
        setStepProgress(0);
        setIsApiProcessing(true);
        setStatus('AI generating your personalized designs...');
        
        // 最后一个步骤进度条动画：2秒内从0%到99%，然后缓冲动画
        const lastStepStartTime = Date.now();
        let reachedMax = false;
        
        const animateLastStepProgress = () => {
          if (!mounted) return;
          
          const elapsed = Date.now() - lastStepStartTime;
          
          if (elapsed < 2000) {
            // 前2秒：从0%到99%
            const progress = (elapsed / 2000) * 99;
            setStepProgress(progress);
          } else {
            // 2秒后：在99%基础上添加缓冲动画
            if (!reachedMax) {
              setStepProgress(99);
              reachedMax = true;
            }
            
            const bufferElapsed = elapsed - 2000;
            // 使用不同频率的sin波动创建更细微的缓冲效果
            const bufferAnimation = Math.sin(bufferElapsed / 800) * 0.3 + 0.3; // 0-0.6的波动
            const bufferProgress = 99 + bufferAnimation;
            setStepProgress(Math.min(bufferProgress, 99.6));
          }
          
          if (stepProgress < 100) {
            requestAnimationFrame(animateLastStepProgress);
          }
        };
        
        animateLastStepProgress();
      }
    };

    // Overall Progress 动画
    const startTime = Date.now();
    const stepDuration = 1000; // 每个步骤1秒
    const totalStepDuration = (analysisSteps.length - 1) * stepDuration; // 前面步骤总时长
    let apiProcessingStartTime = 0;
    
    const animateOverallProgress = () => {
      const elapsed = Date.now() - startTime;
      
      if (!isApiProcessing) {
        // 前面步骤时：在总步骤时间内从0%到95%
        const stepProgress = Math.min(elapsed / totalStepDuration, 1);
        setProgress(stepProgress * 95);
      } else {
        // API处理时：在95%基础上添加缓冲动画
        if (apiProcessingStartTime === 0) {
          apiProcessingStartTime = Date.now();
        }
        
        const apiElapsed = Date.now() - apiProcessingStartTime;
        // 使用sin波动创建缓冲效果，在95%-97.5%之间波动
        const bufferAnimation = Math.sin(apiElapsed / 1000) * 0.5 + 0.5; // 0-1的波动
        const slowProgress = Math.min(apiElapsed / 60000, 1) * 2; // 60秒内缓慢增长2%
        const bufferProgress = 95 + slowProgress + bufferAnimation * 0.5; // 95% + 缓慢增长 + 波动
        setProgress(Math.min(bufferProgress, 97.5));
      }
      
      if (mounted && progress < 100) {
        requestAnimationFrame(animateOverallProgress);
      }
    };
    
    // 开始API调用
    const analyze = async () => {
      try {
        console.log('Starting analysis with image URL:', imageUrl);
        if (!imageUrl) {
          throw new Error('No image URL provided');
        }

        // 等待步骤序列完成
        await runStepSequence();
        
        if (!mounted) return;
        
        const result = await analyzeImage(imageUrl);
        console.log('Analysis result:', result);
        
        if (mounted) {
          // 确保Overall Progress先到95%然后立即跳到100%
          setProgress(95);
          setTimeout(() => {
            if (mounted) {
              setProgress(100);
              setStepProgress(100);
              setCompletedSteps(prev => [...prev, analysisSteps[analysisSteps.length - 1].id]);
              setStatus('Analysis complete!');
              onAnalysisComplete(result);
            }
          }, 100);
        }
      } catch (error) {
        console.error('Analysis error:', error);
        if (mounted) {
          setStatus('Analysis failed');
          onError(error as Error);
        }
      }
    };

    // 启动动画和分析
    const overallProgressInterval = setInterval(() => {
      if (mounted) {
        animateOverallProgress();
      }
    }, 16); // 60fps

    analyze();

    return () => {
      mounted = false;
      clearInterval(overallProgressInterval);
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
            <span className="font-heading font-medium text-gray-900">
              {isApiProcessing && progress >= 95 ? 'Waiting for AI Response...' : 'Overall Progress'}
            </span>
            <span className="font-body text-sm text-gray-600">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-3" />
          {isApiProcessing && progress >= 95 && (
            <p className="font-body text-xs text-gray-500 mt-2">
              Processing may take up to 60 seconds
            </p>
          )}
        </CardContent>
      </Card>

      {/* API Processing Notice */}
      {isApiProcessing && (
        <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center animate-spin">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-heading font-medium text-blue-900 mb-1">
                  AI Processing in Progress
                </h3>
                <p className="font-body text-sm text-blue-700">
                  Our advanced AI is analyzing your space and generating personalized designs. This may take up to 60 seconds...
                </p>
              </div>
              <div className="animate-pulse">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
                          {index === analysisSteps.length - 1 && isApiProcessing ? 'Generating...' : 'Processing...'}
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
      {progress === 100 && completedSteps.length === analysisSteps.length && (
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
