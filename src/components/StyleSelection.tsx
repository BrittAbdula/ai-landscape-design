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
  spaceType: "Backyard Space",
  size: "Medium (Approx. 20-30 m²)",
  existingFeatures: ["Lawn", "Fence", "Partial Hardscape"],
  lighting: "Plenty of sunlight, some shaded areas",
  soilType: "Mixed soil, well-drained",
  climate: "Temperate monsoon climate",
  challenges: ["Layout feels a bit plain", "Lacks vertical interest"],
  opportunities: ["Ample planting space", "Great lighting conditions", "Highly customizable"]
};

const styleOptions: StyleOption[] = [
  {
    id: "modern-minimalist",
    name: "Modern Minimalist",
    description: "Clean lines, curated plants, and a focus on space and function. Effortlessly stylish with AI Landscape Design.",
    icon: <Mountain className="w-6 h-6" />,
    features: ["Sleek geometric shapes", "Low-maintenance plants", "Modern materials", "Functional design"],
    suitability: 95,
    example: "White gravel, ornamental grasses, geometric beds, minimalist outdoor furniture"
  },
  {
    id: "cottage-garden",
    name: "English Cottage Garden",
    description: "Lush blooms, natural curves, and a romantic vibe. Let AI garden design bring your dream garden to life.",
    icon: <Flower className="w-6 h-6" />,
    features: ["Layered flower beds", "Winding paths", "Vintage accents", "Seasonal color"],
    suitability: 85,
    example: "Rose arbors, stone walkways, mixed borders, vintage planters"
  },
  {
    id: "zen-garden",
    name: "Zen Japanese Garden",
    description: "Balance, tranquility, and the perfect blend of water and stone. Experience serenity with AI landscape generator.",
    icon: <TreePine className="w-6 h-6" />,
    features: ["Water features", "Natural stone", "Mossy plants", "Meditation space"],
    suitability: 78,
    example: "Bamboo accents, dry rock gardens, stone lanterns, peaceful streams"
  },
  {
    id: "entertainment",
    name: "Entertainment Oasis",
    description: "The ultimate backyard AI planner for gatherings and family fun. Smart landscaping tool for every occasion.",
    icon: <Users className="w-6 h-6" />,
    features: ["Outdoor dining", "Lounge seating", "BBQ area", "Lighting system"],
    suitability: 88,
    example: "Patio sets, fire pit, outdoor kitchen, ambient lighting"
  },
  {
    id: "mediterranean",
    name: "Mediterranean Escape",
    description: "Warm tones, fragrant herbs, and a taste of Southern Europe. Transform your outdoor space with AI.",
    icon: <Sun className="w-6 h-6" />,
    features: ["Warm materials", "Herb gardens", "Terracotta accents", "Shade structures"],
    suitability: 72,
    example: "Olive trees, lavender, terracotta pots, vine-covered pergola"
  },
  {
    id: "tropical",
    name: "Tropical Paradise",
    description: "Bold foliage and vacation vibes. The best AI landscape design for a lush, exotic retreat.",
    icon: <Coffee className="w-6 h-6" />,
    features: ["Large-leaf plants", "Tropical colors", "Water features", "Resort atmosphere"],
    suitability: 65,
    example: "Banana leaves, palm trees, bamboo decor, tropical flowers"
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
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Eye className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 mb-4">
          AI Landscape Design Complete!
        </h2>
        <p className="text-lg font-body text-gray-600 max-w-2xl mx-auto">
          We've analyzed your outdoor space with our smart landscaping tool. Now, choose your favorite design style or describe your dream garden—let the best AI landscape design engine do the rest!
        </p>
      </div>

      {/* Analysis Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Image Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-heading">Your Space</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video rounded-lg overflow-hidden mb-4">
              <img
                src={uploadedImage}
                alt="Uploaded outdoor space"
                className="w-full h-full object-cover"
              />
            </div>
          </CardContent>
        </Card>

        {/* Analysis Results */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-heading">AI Analysis</CardTitle>
            <CardDescription>Key features detected by our AI garden design engine</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Essentials</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p><span className="font-medium">Type:</span> {currentAnalysisResult.spaceType}</p>
                <p><span className="font-medium">Size:</span> {currentAnalysisResult.size}</p>
                <p><span className="font-medium">Lighting:</span> {currentAnalysisResult.lighting}</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Existing Features</h4>
              <div className="flex flex-wrap gap-1">
                {currentAnalysisResult.existingFeatures.map((feature) => (
                  <Badge key={feature} variant="secondary" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Opportunities</h4>
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

      {/* Style Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-heading">Choose Your AI Landscape Design Style</CardTitle>
          <CardDescription>
            Our AI for landscape design recommends these styles for your space. The higher the match, the more your backyard will thrive!
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
                    Example: {style.example}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Custom Prompt Option */}
          <div className="border-t pt-6">
            <div className="flex items-center space-x-3 mb-4">
              <Button
                variant={useCustomPrompt ? "default" : "outline"}
                onClick={handleCustomPromptToggle}
                className={useCustomPrompt ? "bg-green-600 hover:bg-green-700" : ""}
              >
                <Palette className="w-4 h-4 mr-2" />
                Custom Design Description
              </Button>
              <span className="text-sm text-gray-600">
                Or tell us your unique vision for your landscape AI design
              </span>
            </div>

            {useCustomPrompt && (
              <div className="space-y-3">
                <Textarea
                  placeholder={"Describe your dream backyard...\nFor example: I want a modern minimalist garden with water features and a lounge area, perfect for relaxing in the evening. (Tip: Mention style, colors, plant types, functional zones, or anything you want!)"}
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="min-h-[100px] resize-none"
                />
                <p className="text-xs text-gray-500">
                  Tip: Share your style, colors, favorite plants, or any ideas—our AI landscape design free tool will make it real!
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <Button
          variant="outline"
          onClick={onBack}
          className="border-gray-300 text-gray-600 hover:bg-gray-50"
        >
          ← Upload a New Image
        </Button>

        <Button
          onClick={handleContinue}
          disabled={!canContinue}
          className="bg-green-600 hover:bg-green-700 text-white hover-lift disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Generate My AI Landscape Design
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
} 