"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Eye, 
  TreePine, 
  Sun, 
  Home, 
  Sparkles, 
  ArrowRight,
  Palette,
  Mountain,
  Flower,
  Coffee,
  Users
} from "lucide-react";

interface StyleSelectionProps {
  uploadedImage: string;
  analysisResult?: AnalysisResult;
  onStyleSelected: (style: string, customPrompt?: string) => void;
  onBack: () => void;
}

interface AnalysisResult {
  spaceType: string;
  size: string;
  existingFeatures: string[];
  lighting: string;
  soilType: string;
  climate: string;
  challenges: string[];
  opportunities: string[];
}

interface StyleOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  suitability: number; // 0-100
  example: string;
}

// 模拟的分析结果
const mockAnalysisResult: AnalysisResult = {
  spaceType: "后院空间",
  size: "中等大小 (约20-30平方米)",
  existingFeatures: ["草坪", "围栏", "部分硬化地面"],
  lighting: "充足阳光，部分阴影区域",
  soilType: "混合土壤，排水良好",
  climate: "温带季风气候",
  challenges: ["空间布局相对单调", "缺乏垂直层次"],
  opportunities: ["充足的种植空间", "良好的采光条件", "可塑性强"]
};

const styleOptions: StyleOption[] = [
  {
    id: "modern-minimalist",
    name: "现代简约风格",
    description: "简洁线条，精选植物，注重空间感和功能性",
    icon: <Mountain className="w-6 h-6" />,
    features: ["简洁几何造型", "低维护植物", "现代材料运用", "功能性设计"],
    suitability: 95,
    example: "白色砾石、观赏草、几何花池、简约户外家具"
  },
  {
    id: "cottage-garden",
    name: "英式花园风格",
    description: "丰富的花卉组合，自然曲线，营造浪漫氛围",
    icon: <Flower className="w-6 h-6" />,
    features: ["丰富花卉层次", "弯曲小径", "复古元素", "季节性变化"],
    suitability: 85,
    example: "玫瑰花架、石板小径、混合花境、复古花盆"
  },
  {
    id: "zen-garden",
    name: "禅意日式风格",
    description: "注重平衡与宁静，水景与石景的完美结合",
    icon: <TreePine className="w-6 h-6" />,
    features: ["水景元素", "天然石材", "苔藓植物", "冥想空间"],
    suitability: 78,
    example: "竹子装饰、枯山水、石灯笼、小桥流水"
  },
  {
    id: "entertainment",
    name: "休闲娱乐风格",
    description: "适合聚会和家庭活动的多功能空间设计",
    icon: <Users className="w-6 h-6" />,
    features: ["户外餐厅", "休闲座椅", "烧烤区域", "照明系统"],
    suitability: 88,
    example: "露台桌椅、火炉设施、户外厨房、聚光照明"
  },
  {
    id: "mediterranean",
    name: "地中海风格",
    description: "温暖的色调，香草植物，体现南欧的悠闲生活",
    icon: <Sun className="w-6 h-6" />,
    features: ["暖色调材料", "香草花园", "陶土元素", "遮阳结构"],
    suitability: 72,
    example: "橄榄树、薰衣草、陶土花盆、藤蔓遮阳棚"
  },
  {
    id: "tropical",
    name: "热带风情风格",
    description: "热带植物，创造度假胜地般的氛围",
    icon: <Coffee className="w-6 h-6" />,
    features: ["大型叶片植物", "热带色彩", "水景装饰", "度假氛围"],
    suitability: 65,
    example: "芭蕉叶、棕榈树、竹制装饰、热带花卉"
  }
];

export default function StyleSelection({ uploadedImage, analysisResult, onStyleSelected, onBack }: StyleSelectionProps) {
  const [selectedStyle, setSelectedStyle] = useState<string>("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [useCustomPrompt, setUseCustomPrompt] = useState(false);

  // 使用传入的分析结果或默认数据
  const currentAnalysisResult = analysisResult || mockAnalysisResult;

  const handleStyleSelect = (styleId: string) => {
    setSelectedStyle(styleId);
    setUseCustomPrompt(false);
    setCustomPrompt("");
  };

  const handleCustomPromptToggle = () => {
    setUseCustomPrompt(!useCustomPrompt);
    setSelectedStyle("");
  };

  const handleContinue = () => {
    if (useCustomPrompt && customPrompt.trim()) {
      onStyleSelected("custom", customPrompt.trim());
    } else if (selectedStyle) {
      const selectedStyleOption = styleOptions.find(style => style.id === selectedStyle);
      onStyleSelected(selectedStyle, selectedStyleOption?.name);
    }
  };

  const canContinue = (useCustomPrompt && customPrompt.trim()) || (!useCustomPrompt && selectedStyle);

  return (
    <div className="space-y-8">
      {/* 头部 */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Eye className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 mb-4">
          图片分析完成！
        </h2>
        <p className="text-lg font-body text-gray-600 max-w-2xl mx-auto">
          我们已经分析了您的空间，现在请选择您喜欢的设计风格，或者描述您的理想设计。
        </p>
      </div>

      {/* 分析结果 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 图片预览 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-heading">您的空间</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video rounded-lg overflow-hidden mb-4">
              <img
                src={uploadedImage}
                alt="上传的空间图片"
                className="w-full h-full object-cover"
              />
            </div>
          </CardContent>
        </Card>

        {/* 分析结果 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-heading">空间分析</CardTitle>
            <CardDescription>基于AI分析的空间特征</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">基本信息</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p><span className="font-medium">空间类型：</span>{currentAnalysisResult.spaceType}</p>
                <p><span className="font-medium">大小：</span>{currentAnalysisResult.size}</p>
                <p><span className="font-medium">光照条件：</span>{currentAnalysisResult.lighting}</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">现有特征</h4>
              <div className="flex flex-wrap gap-1">
                {currentAnalysisResult.existingFeatures.map((feature) => (
                  <Badge key={feature} variant="secondary" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">设计机会</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {currentAnalysisResult.opportunities.map((opportunity, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    {opportunity}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 风格选择 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-heading">选择您的设计风格</CardTitle>
          <CardDescription>
            我们根据您的空间特点推荐了以下风格，匹配度越高越适合您的空间
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {styleOptions.map((style) => (
              <Card
                key={style.id}
                className={`cursor-pointer transition-all duration-300 hover-lift ${
                  selectedStyle === style.id && !useCustomPrompt
                    ? 'border-green-500 shadow-lg ring-2 ring-green-200'
                    : 'border-gray-200 hover:border-green-300'
                }`}
                onClick={() => handleStyleSelect(style.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                        {style.icon}
                      </div>
                      <div>
                        <h3 className="font-heading font-medium">{style.name}</h3>
                        <div className="flex items-center space-x-1">
                          <div className="w-12 h-1 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-green-500 rounded-full"
                              style={{ width: `${style.suitability}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500">{style.suitability}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">{style.description}</p>

                  <div className="space-y-2 mb-3">
                    <div className="flex flex-wrap gap-1">
                      {style.features.slice(0, 2).map((feature) => (
                        <Badge key={feature} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 italic">
                    示例：{style.example}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 自定义描述选项 */}
          <div className="border-t pt-6">
            <div className="flex items-center space-x-3 mb-4">
              <Button
                variant={useCustomPrompt ? "default" : "outline"}
                onClick={handleCustomPromptToggle}
                className={useCustomPrompt ? "bg-green-600 hover:bg-green-700" : ""}
              >
                <Palette className="w-4 h-4 mr-2" />
                自定义设计描述
              </Button>
              <span className="text-sm text-gray-600">
                或者告诉我们您的具体想法
              </span>
            </div>

            {useCustomPrompt && (
              <div className="space-y-3">
                <Textarea
                  placeholder="请描述您理想中的庭院设计...&#10;例如：我想要一个现代简约的花园，有水景和休息区，适合晚上放松..."
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="min-h-[100px] resize-none"
                />
                <p className="text-xs text-gray-500">
                  提示：您可以描述想要的风格、颜色、植物类型、功能区域等任何想法
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 操作按钮 */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <Button
          variant="outline"
          onClick={onBack}
          className="border-gray-300 text-gray-600 hover:bg-gray-50"
        >
          ← 重新上传图片
        </Button>

        <Button
          onClick={handleContinue}
          disabled={!canContinue}
          className="bg-green-600 hover:bg-green-700 text-white hover-lift disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          开始生成设计方案
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
} 