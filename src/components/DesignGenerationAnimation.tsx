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
  Loader2,
  Brain
} from "lucide-react";

/* eslint-disable prefer-const */

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
    duration: 1000,
  },
  {
    id: 'layout',
    title: 'Adjusting Layout Structure',
    description: 'Optimizing the layout for your outdoor space with AI garden design...',
    icon: Layers,
    duration: 1000,
  },
  {
    id: 'details',
    title: 'Enhancing Details',
    description: 'Refining design details using smart landscaping tools...',
    icon: Palette,
    duration: 1000,
  },
  {
    id: 'final',
    title: 'Final Rendering',
    description: 'Generating the final result with the best AI landscape design generator...',
    icon: CheckCircle2,
    duration: 0, // 最后一个步骤等待API返回
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
  const [isApiProcessing, setIsApiProcessing] = useState(false);

  useEffect(() => {
    let mounted = true;

    const runStepSequence = async () => {
      // 执行前面的步骤（每个1秒）
      for (let i = 0; i < generationSteps.length - 1; i++) {
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
          setCompletedSteps(prev => [...prev, generationSteps[i].id]);
          setStepProgress(100);
        }
      }
      
      // 开始最后一个步骤（等待API）
      if (mounted) {
        setCurrentStep(generationSteps.length - 1);
        setStepProgress(0);
        setIsApiProcessing(true);
        setStatus('AI generating your final design...');
        
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
    const totalStepDuration = (generationSteps.length - 1) * stepDuration; // 前面步骤总时长
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
    const generate = async () => {
      try {
        console.log('Starting design generation...');
        
        // 等待步骤序列完成
        await runStepSequence();
        
        if (!mounted) return;
        
        let result;
        if (style === 'custom' && customPrompt) {
          result = await generateDesign(analysisResult, style, customPrompt, originalImageUrl);
        } else {
          result = await generateDesign(analysisResult, style, undefined, originalImageUrl);
        }
        
        if (mounted) {
          // 确保Overall Progress先到95%然后立即跳到100%
          setProgress(95);
          setTimeout(() => {
            if (mounted) {
              setProgress(100);
              setStepProgress(100);
              setCompletedSteps(prev => [...prev, generationSteps[generationSteps.length - 1].id]);
              setStatus('Generation Complete! Transform your outdoor space with AI.');
              onGenerationComplete(result);
            }
          }, 100);
        }
      } catch (error) {
        console.error('Generation error:', error);
        if (mounted) {
          setStatus('Generation Failed. Please try again with our free AI landscape design tool.');
          onError(error as Error);
        }
      }
    };

    // 启动动画和生成
    const overallProgressInterval = setInterval(() => {
      if (mounted) {
        animateOverallProgress();
      }
    }, 16); // 60fps

    generate();

    return () => {
      mounted = false;
      clearInterval(overallProgressInterval);
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

      {/* Overall Progress */}
      <Card className="mb-6">
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
              Design generation may take up to 60 seconds
            </p>
          )}
        </CardContent>
      </Card>

      {/* API Processing Notice */}
      {isApiProcessing && (
        <Card className="mb-6 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center animate-spin">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-heading font-medium text-blue-900 mb-1">
                  AI Design Generation in Progress
                </h3>
                <p className="font-body text-sm text-blue-700">
                  Our advanced AI is creating your personalized landscape design. This may take up to 60 seconds...
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

      {/* Generation Steps */}
      <div className="space-y-3">
        {generationSteps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = index === currentStep;
          const isPending = index > currentStep;
          const Icon = step.icon;

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
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
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
                          {index === generationSteps.length - 1 && isApiProcessing ? 'Generating...' : 'Processing...'}
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
      {progress === 100 && completedSteps.length === generationSteps.length && (
        <Card className="mt-6 border-2 border-gradient-to-r from-green-500 to-blue-500 bg-gradient-to-br from-green-50 to-blue-50">
          <CardContent className="p-6 text-center">
            <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <h3 className="font-heading font-semibold text-green-900 mb-2">
              Design Generation Complete!
            </h3>
            <p className="font-body text-green-700">
              Your personalized landscape design is ready. View your beautiful new space!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 